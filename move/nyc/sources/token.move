// Copyright (c) Aptos Labs
// SPDX-License-Identifier: Apache-2.0

module addr::nyc_token {
    use addr::nyc_collection::{
        assert_caller_is_collection_admin,
        get_art_data,
        get_collection_name,
        get_collection_owner_signer,
        get_minting_enabled,
        get_piece_data,
        get_piece_description,
        get_piece_metadata,
        get_piece_name,
        get_piece_uri,
        is_token_owner,
        record_minted,
    };
    use std::error;
    use std::option;
    use std::string::{Self, String};
    use std::signer;
    use std::vector;
    use aptos_std::object::{Self, ConstructorRef, Object};
    use aptos_std::simple_map;
    use aptos_token_objects::token::{Self, MutatorRef, Token};
    use aptos_token_objects::property_map;

    /// You have already minted this piece of art.
    const E_ALREADY_MINTED: u64 = 100;

    /// Minting is globally disabled at the moment.
    const E_MINTING_DISABLED: u64 = 101;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct TokenRefs has key {
        /// We need this so the collection owner can update the description, URI, etc
        /// if necessary.
        mutator_ref: MutatorRef,

        /// Store the piece ID too, we need it do some mutations more easily.
        piece_id: String,
    }

    /// Mint one of the pieces of art in the collection. Anyone can call this.
    public entry fun mint(caller: &signer, piece_id: String) {
        let caller_addr = signer::address_of(caller);
        mint_inner(caller_addr, piece_id);
    }

    /// Helper function. The collection admins can mint any token they want to whoever
    /// they want.
    public entry fun mint_to(
        caller: &signer,
        piece_id: String,
        mint_to: address
    ) {
        // Confirm the caller is a collection admin.
        assert_caller_is_collection_admin(caller);

        // For now we're making it that only the collection owner can mint tokens.
        mint_inner(mint_to, piece_id);
    }

    // This function is separate from the top level mint function so we can use it
    // in tests. This is necessary because entry functions (correctly) cannot return
    // anything but we need it to return the object with the canvas in it. They also
    // cannot take in struct arguments, which again is convenient for testing.
    //
    // It is intentional that these tokens are not soulbound.
    fun mint_inner(mint_to: address, piece_id: String): Object<Token> {
        assert!(get_minting_enabled(), error::invalid_state(E_MINTING_DISABLED));

        let art_data = get_art_data();
        let piece_data = get_piece_data(&art_data, &piece_id);

        let name_prefix = get_piece_name(piece_data);
        string::append(&mut name_prefix, string::utf8(b" #"));

        let name_suffix = string::utf8(b"");
        let description = get_piece_description(piece_data);
        let uri = get_piece_uri(piece_data);

        // Confirm the user does not already own this piece of art.
        assert!(
            !is_token_owner(mint_to, &piece_id),
            error::invalid_state(E_ALREADY_MINTED)
        );

        // Get the signer of the owner of the collection.
        let collection_owner_signer = get_collection_owner_signer();

        // Create the token. This mints an ObjectCore and Token.
        let constructor_ref = token::create_numbered_token(
            &collection_owner_signer,
            get_collection_name(),
            description,
            name_prefix,
            name_suffix,
            option::none(),
            uri,
        );

        // Set a property map on the token with all the piece metadata so it shows
        // up in the attributes section in Petra.
        set_property_map(&constructor_ref, piece_id);

        let object_signer = object::generate_signer(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);

        move_to(
            &object_signer,
            TokenRefs {mutator_ref, piece_id}
        );

        // Transfer ownership of the token to the minter.
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let linear_transfer_ref = object::generate_linear_transfer_ref(&transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, mint_to);

        // Record that the user has minted this piece of art.
        record_minted(mint_to, piece_id);

        object::object_from_constructor_ref(&constructor_ref)
    }

    fun set_property_map(constructor_ref: &ConstructorRef, piece_id: String) {
        let art_data = get_art_data();
        let piece_data = get_piece_data(&art_data, &piece_id);
        let metadata = get_piece_metadata(piece_data);
        property_map::init(
            constructor_ref,
            property_map::prepare_input(vector::empty(), vector::empty(), vector::empty())
        );
        let mutator_ref = property_map::generate_mutator_ref(constructor_ref);
        let (keys, values) = simple_map::to_vec_pair(metadata);
        vector::zip(
            keys,
            values,
            |key, value| {
                // TODO: Replace _ with " "
                // https://aptos-org.slack.com/archives/C036X27DZNG/p1715368231700529
                property_map::add_typed(&mutator_ref, key, value);
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////////////////
    //                                 Collection owner                              //
    ///////////////////////////////////////////////////////////////////////////////////
    // Functions that only the collection owner can call.

    /// For a given list of tokens, update the token name, description, and URI based on
    /// the current ArtData.
    //
    // TODO: Support fixing the property map based on the metadata too.
    public entry fun fix_data(
        caller: &signer,
        tokens: vector<Object<Token>>,
    ) acquires TokenRefs {
        assert_caller_is_collection_admin(caller);

        let art_data = get_art_data();

        vector::for_each(
            tokens,
            |token| {
                let object_addr = object::object_address(&token);
                let refs_ = borrow_global<TokenRefs>(object_addr);
                let piece_data = get_piece_data(&art_data, &refs_.piece_id);
                token::set_name(
                    &refs_.mutator_ref,
                    get_piece_name(piece_data)
                );
                token::set_description(
                    &refs_.mutator_ref,
                    get_piece_description(piece_data)
                );
                token::set_uri(
                    &refs_.mutator_ref,
                    get_piece_uri(piece_data)
                );
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////////////////
    //                                     Tests                                     //
    ///////////////////////////////////////////////////////////////////////////////////

    #[test_only]
    use addr::nyc_collection::{
        create_for_test as create_collection_for_test,
        set_art_data,
        set_minting_enabled,
    };
    #[test_only]
    use std::timestamp;
    #[test_only]
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    #[test_only]
    use aptos_framework::account::{ Self };
    #[test_only]
    use aptos_framework::coin;
    #[test_only]
    use aptos_framework::chain_id;

    #[test_only]
    const ONE_APT: u64 = 100000000;

    #[test_only]
    const STARTING_BALANCE: u64 = 50 * 100000000;

    #[test_only]
    /// Create a test account with some funds.
    fun create_test_account(
        _caller: &signer,
        aptos_framework: &signer,
        account: &signer,
    ) {
        if (!aptos_coin::has_mint_capability(aptos_framework)) {
            // If aptos_framework doesn't have the mint cap it means we need to do some
            // initialization. This function will initialize AptosCoin and store the
            // mint cap in aptos_framwork. These capabilities that are returned from the
            // function are just copies. We don't need them since we use aptos_coin::mint
            // to mint coins, which uses the mint cap from the MintCapStore on
            // aptos_framework. So we burn them.
            let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
            coin::destroy_burn_cap(burn_cap);
            coin::destroy_mint_cap(mint_cap);
        };
        account::create_account_for_test(signer::address_of(account));
        coin::register<AptosCoin>(account);
        aptos_coin::mint(
            aptos_framework,
            signer::address_of(account),
            STARTING_BALANCE
        );
    }

    #[test_only]
    public fun set_global_time(
        aptos_framework: &signer,
        timestamp: u64
    ) {
        timestamp::set_time_has_started_for_testing(aptos_framework);
        timestamp::update_global_time_for_test_secs(timestamp);
    }

    #[test_only]
    fun init_test(
        caller: &signer,
        friend1: &signer,
        friend2: &signer,
        aptos_framework: &signer
    ) {
        set_global_time(aptos_framework, 100);
        chain_id::initialize_for_test(aptos_framework, 3);
        create_collection_for_test(caller);

        set_art_data(
            caller,
            string::utf8(b"pieceid1"),
            string::utf8(b"Piece 1"),
            string::utf8(b"Piece 1 description"),
            string::utf8(b"Piece 1 URI"),
            vector::empty(),
            vector::empty()
        );
        set_art_data(
            caller,
            string::utf8(b"pieceid2"),
            string::utf8(b"Piece 2"),
            string::utf8(b"Piece 2 description"),
            string::utf8(b"Piece 2 URI"),
            vector::empty(),
            vector::empty()
        );
        create_test_account(caller, aptos_framework, caller);
        create_test_account(caller, aptos_framework, friend1);
        create_test_account(caller, aptos_framework, friend2);
    }

    #[test_only]
    fun mint_token(caller: &signer, piece_id: String): Object<Token> {
        mint_inner(
            signer::address_of(caller),
            piece_id
        )
    }

    // See that not just the creator can mint a token.
    #[test(caller = @addr, friend1 = @0x456, friend2 = @0x789, aptos_framework = @aptos_framework)]
    fun test_mint(
        caller: signer,
        friend1: signer,
        friend2: signer,
        aptos_framework: signer
    ) {
        init_test(
            &caller,
            &friend1,
            &friend2,
            &aptos_framework
        );
        let tok1 = mint_token(&caller, string::utf8(b"pieceid1"));
        aptos_std::debug::print(&token::uri(tok1));
        let tok2 = mint_token(&friend1, string::utf8(b"pieceid1"));
        aptos_std::debug::print(&token::uri(tok2));
    }

    // Confirm that you can't mint the same piece of art to the same address twice.
    #[expected_failure(abort_code = 196708, location = Self)]
    #[test(caller = @addr, friend1 = @0x456, friend2 = @0x789, aptos_framework = @aptos_framework)]
    fun test_mint_twice(
        caller: signer,
        friend1: signer,
        friend2: signer,
        aptos_framework: signer
    ) {
        init_test(
            &caller,
            &friend1,
            &friend2,
            &aptos_framework
        );
        mint_token(&friend1, string::utf8(b"pieceid1"));
        mint_token(&friend1, string::utf8(b"pieceid1"));
    }

    // Confirm that you can mint multiple tokens in the collection so long as they have
    // different piece IDs.
    #[test(caller = @addr, friend1 = @0x456, friend2 = @0x789, aptos_framework = @aptos_framework)]
    fun test_mint_twice_different_piece_ids(
        caller: signer,
        friend1: signer,
        friend2: signer,
        aptos_framework: signer
    ) {
        init_test(
            &caller,
            &friend1,
            &friend2,
            &aptos_framework
        );
        mint_token(&friend1, string::utf8(b"pieceid1"));
        mint_token(&friend1, string::utf8(b"pieceid2"));
    }

    // Confirm that you can't mint with an unknown art ID.
    #[expected_failure(abort_code = 65538, location = aptos_std::simple_map)]
    #[test(caller = @addr, friend1 = @0x456, friend2 = @0x789, aptos_framework = @aptos_framework)]
    fun test_mint_unknown_piece_id(
        caller: signer,
        friend1: signer,
        friend2: signer,
        aptos_framework: signer
    ) {
        init_test(
            &caller,
            &friend1,
            &friend2,
            &aptos_framework
        );
        mint_token(
            &friend1,
            string::utf8(b"pieceidunknown")
        );
    }

    // Confirm that you can update existing art data and fix_Data works.
    #[test(caller = @addr, friend1 = @0x456, friend2 = @0x789, aptos_framework = @aptos_framework)]
    fun test_upsert_art_data_then_fix(
        caller: signer,
        friend1: signer,
        friend2: signer,
        aptos_framework: signer
    ) acquires TokenRefs {
        init_test(
            &caller,
            &friend1,
            &friend2,
            &aptos_framework
        );
        // Mint a token.
        let tok1 = mint_token(&friend1, string::utf8(b"pieceid1"));

        // Update the data for pieceid1.
        set_art_data(
            &caller,
            string::utf8(b"pieceid1"),
            string::utf8(b"Piece 1"),
            string::utf8(b"newdescription"),
            string::utf8(b"Piece 1 URI"),
            vector::empty(),
            vector::empty()
        );

        // Mint a new token and see that it uses the new description.
        let tok2 = mint_token(&friend2, string::utf8(b"pieceid1"));
        assert!(
            token::description(tok2) == string::utf8(b"newdescription"),
            0
        );

        // Confirm the description is still the old value for the old token.
        assert!(
            token::description(tok1) == string::utf8(b"Piece 1 description"),
            0
        );

        // Call the fix function.
        fix_data(&caller, vector::singleton(tok1));

        // See that the description for the old token has been updated.
        assert!(
            token::description(tok1) == string::utf8(b"newdescription"),
            0
        );
    }

    // Confirm that others can not update the URI.
    #[expected_failure(abort_code = 196610, location = addr::nyc_collection)]
    #[test(caller = @addr, friend1 = @0x456, friend2 = @0x789, aptos_framework = @aptos_framework)]
    fun test_set_art_data_not_creator(
        caller: signer,
        friend1: signer,
        friend2: signer,
        aptos_framework: signer
    ) {
        init_test(
            &caller,
            &friend1,
            &friend2,
            &aptos_framework
        );
        set_art_data(
            &friend1,
            string::utf8(b"blah"),
            string::utf8(b"blah"),
            string::utf8(b"blah"),
            string::utf8(b"blah"),
            vector::empty(),
            vector::empty()
        );
    }

    // Confirm that you cannot mint if minting_enabled is false.
    #[expected_failure(abort_code = 196709, location = Self)]
    #[test(caller = @addr, friend1 = @0x456, friend2 = @0x789, aptos_framework = @aptos_framework)]
    fun test_mint_minting_disabled(
        caller: signer,
        friend1: signer,
        friend2: signer,
        aptos_framework: signer
    ) {
        init_test(
            &caller,
            &friend1,
            &friend2,
            &aptos_framework
        );
        set_minting_enabled(&caller, false);
        mint_token(
            &friend1,
            string::utf8(b"pieceid1")
        );
    }
}

