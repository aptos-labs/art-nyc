// Copyright (c) Aptos Labs
// SPDX-License-Identifier: Apache-2.0

module addr::nyc_collection {
    use std::error;
    use std::option;
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_std::object::{Self, Object, ExtendRef};
    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_std::smart_table::{Self, SmartTable};
    use aptos_token_objects::collection::{Self, Collection, MutatorRef};

    friend addr::nyc_token;

    /// The caller tried to call a function that requires collection owner privileges.
    const E_CALLER_NOT_COLLECTION_OWNER: u64 = 1;

    /// The account that is allowed to create the collection. For now we just enforce
    /// that the collection creator is the same account that published the module.
    const PERMITTED_COLLECTION_CREATOR: address = @addr;

    /// Resource we store at the object address to enable mutation / of the collection.
    struct CollectionRefs has key {
        collection_mutator_ref: MutatorRef,
        owner_extend_ref: ExtendRef,
    }

    /// Track which pieces of art we have minted to each account. Even if the account
    /// transfers the art elsewhere, we will still not allow them to mint the same
    /// piece again.
    struct TokenOwners has key {
        /// This is a map from account address to a vec of art IDs, which is a string
        /// that uniquely identifies each piece of art.
        //
        // There are few enough different pieces of art that we can just use a vec
        // rather than something that supports O(1) lookup (given the lack of native
        // map / set types).
        owners: SmartTable<address, vector<String>>,
    }

    /// The data for a single piece of art in the collection. Whenever we update these,
    /// we also update the values for any existing tokens. Name cannot be mutated.
    struct PieceData has copy, drop, store {
        // This is used as the name prefix, we don't use a name suffix.
        token_name: String,
        token_description: String,
        token_uri: String,
    }

    /// This is how we store the data for each piece of art.
    struct ArtData has copy, drop, key {
        /// A map of art ID to the data for that piece of art. Art ID should be a
        /// string roughly matching this regex: [a-z]{1}[a-z0-9-_]*
        data: SimpleMap<String, PieceData>,
    }

    const COLLECTION_NAME: vector<u8> = b"APTOS PASSPORT: Ecosystem Summit One";
    const COLLECTION_SEED: vector<u8> = b"AptosPassportEcosystemSummitOneSeed";

    /// Create the collection and all the related structs.
    /// You can only call this once unless you change COLLECTION_SEED.
    public entry fun create(publisher: &signer) {
        // For now only allow the module publisher to create collections.
        assert_caller_is_collection_creator(publisher);

        let collection_name = get_collection_name();

        // Create an object that will own the collection. This is necessary due to
        // intentional restrictiveness in our token API.
        // https://aptos-org.slack.com/archives/C036X27DZNG/p1705852198895739
        let constructor_ref = object::create_named_object(publisher, COLLECTION_SEED);
        let collection_owner_signer = object::generate_signer(&constructor_ref);

        // Generate an extend ref so we can get a signer to mint tokens in the collection.
        let owner_extend_ref = object::generate_extend_ref(&constructor_ref);

        let constructor_ref = collection::create_unlimited_collection(
            &collection_owner_signer,
            // todo update this
            // \xF0\x9F\x8C\x90 is the globe emoji.
            string::utf8(
                b"This NFT collection commemorates the first ever Aptos Ecosystem Summit from January 22-26, 2024. This week brought together 40+ premier Aptos projects, partners, and supporters to celebrate Aptos innovation across the ecosystem. These NFTs are soulbound to honor the growing community of builders who have gathered for Aptos in real life. The artwork is algorithmically generated, so every piece of art is completely unique. As part of the APTOS PASSPORT, these NFTs will serve as an access point for deeper connection with the Aptos community. Thank you to everyone who joined the Aptos Foundation for the 2024 Aptos Ecosystem Summit in Palo Alto, CA. Make Every M\xF0\x9F\x8C\x90ve Count."
            ),
            collection_name,
            option::none(),
            // todo update this to a gif of all the art or something
            string::utf8(
                b"https://storage.googleapis.com/aptos-summits/images/collection.png"
            ),
        );

        let collection_mutator_ref = collection::generate_mutator_ref(&constructor_ref);
        let collection_refs = CollectionRefs {
            collection_mutator_ref,
            owner_extend_ref
        };

        let object_signer = object::generate_signer(&constructor_ref);

        // Store the refs alongside the collection.
        move_to(&object_signer, collection_refs);

        // Store the map of who owns which pieces of art in the collection.
        move_to(
            &object_signer,
            TokenOwners {owners: smart_table::new(),},
        );

        // Store the art data, empty at first.
        move_to(
            &object_signer,
            ArtData {data: simple_map::new()}
        )
    }

    /// Set the URI of the collection.
    public entry fun set_uri(caller: &signer, uri: String) acquires CollectionRefs {
        assert_caller_is_collection_creator(caller);
        let collection = get_collection();
        let collection_refs = borrow_global<CollectionRefs>(
            object::object_address(&collection)
        );
        collection::set_uri(
            &collection_refs.collection_mutator_ref,
            uri
        );
    }

    /// Set the description of the collection.
    public entry fun set_description(caller: &signer, description: String) acquires CollectionRefs {
        assert_caller_is_collection_creator(caller);
        let collection = get_collection();
        let collection_refs = borrow_global<CollectionRefs>(
            object::object_address(&collection)
        );
        collection::set_description(
            &collection_refs.collection_mutator_ref,
            description
        );
    }

    /// Get the collection. Note, if the module is republished with a different
    /// address for the permitted collection creator after the collection has been
    /// created, this will cease to work. Same thing if the collection name is changed.
    public(friend) fun get_collection(): Object<Collection> {
        // Get the address of the account we created to own the collection.
        let collection_creator_address = object::create_object_address(
            &PERMITTED_COLLECTION_CREATOR,
            COLLECTION_SEED,
        );
        // Pass that in to figure out the collection address.
        let collection_address = collection::create_collection_address(
            &collection_creator_address,
            &get_collection_name(),
        );
        object::address_to_object<Collection>(collection_address)
    }

    /// So we can mint tokens in the collection. Friend function so only token.move can
    /// call it.
    public(friend) fun get_collection_owner_signer(): signer acquires CollectionRefs {
        let collection = get_collection();
        let collection_refs = borrow_global<CollectionRefs>(
            object::object_address(&collection)
        );
        object::generate_signer_for_extending(&collection_refs.owner_extend_ref)
    }

    public fun get_collection_name(): String {
        string::utf8(COLLECTION_NAME)
    }

    /// Confirm the caller is the creator of the collection. Notably they're not the
    /// owner of the collection, an object that the caller owns is.
    public fun assert_caller_is_collection_creator(caller: &signer) {
        assert!(
            is_creator(caller),
            error::invalid_state(E_CALLER_NOT_COLLECTION_OWNER)
        );
    }

    /// This is not is_owner, it is based on where the contract is deployed, not who
    /// owns the collection. The contract deployer is the one we give privileges to.
    public fun is_creator(caller: &signer): bool {
        signer::address_of(caller) == PERMITTED_COLLECTION_CREATOR
    }

    /// Returns true if the given account owns a specific piece of art in the
    /// collection.
    public fun is_token_owner(address: address, art_id: &String): bool acquires TokenOwners {
        let collection = get_collection();
        let token_owners = borrow_global<TokenOwners>(
            object::object_address(&collection)
        );
        let owned = smart_table::borrow_with_default(
            &token_owners.owners,
            address,
            &vector::empty()
        );
        vector::contains(owned, art_id)
    }

    /// Record that we minted a particular piece of art in the collection to the given
    /// address.
    public(friend) fun record_minted(address: address, art_id: String) acquires TokenOwners {
        let collection = get_collection();
        let token_owners = borrow_global_mut<TokenOwners>(
            object::object_address(&collection)
        );
        let owned = smart_table::borrow_mut_with_default(
            &mut token_owners.owners,
            address,
            vector::empty()
        );
        vector::push_back(owned, art_id,);
    }

    /// Set / update the data for a piece of art. This affects future mints, it does
    /// not correct the data for existing tokens. For that, see the fix_data function
    /// in token.move.
    //
    // Originally I was going to make it disallowed to update the token name because
    // I thought it wasn't possible but apparently it is, set_name exists. I'll double
    // check that our indexing supports it though. <-- TODO
    public entry fun set_art_data(
        caller: &signer,
        art_id: String,
        token_name: String,
        token_description: String,
        token_uri: String,
    ) acquires ArtData {
        assert_caller_is_collection_creator(caller);
        let collection = get_collection();

        // Set the art data.
        let art_data = borrow_global_mut<ArtData>(
            object::object_address(&collection)
        );
        if (simple_map::contains_key(&art_data.data, &art_id)) {
            let piece_data = simple_map::borrow_mut(&mut art_data.data, &art_id);
            piece_data.token_name = token_name;
            piece_data.token_description = token_description;
            piece_data.token_uri = token_uri;
        } else {
            let piece_data = PieceData {
                token_name,
                token_description,
                token_uri,
            };
            simple_map::add(
                &mut art_data.data,
                art_id,
                piece_data
            );
        };
    }

    /// Get a copy of the art data.
    //
    // TODO: Try to instead return references to PieceData so we can dispense with the
    // copy and drop abilities on these types. It might not be possible though.
    public fun get_art_data(): ArtData acquires ArtData {
        let collection = get_collection();
        let art_data = borrow_global<ArtData>(
            object::object_address(&collection)
        );
        *art_data
    }

    // The next few functions are only necessary because accessing the fields of a
    // struct from outside / the module where it is defined is not allowed.

    public fun get_piece_data(art_data: &ArtData, art_id: &String): &PieceData {
        simple_map::borrow(&art_data.data, art_id)
    }

    public fun get_piece_name(piece_data: &PieceData): String {
        piece_data.token_name
    }

    public fun get_piece_description(piece_data: &PieceData): String {
        piece_data.token_description
    }

    public fun get_piece_uri(piece_data: &PieceData): String {
        piece_data.token_uri
    }

    #[test_only]
    public fun create_for_test(publisher: &signer) {
        create(publisher);
    }
}
