// See the README for an explanation of where these came from.

export const COLLECTION_ABI = {
  "address": "0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30",
  "name": "nyc_collection",
  "friends": [
    "0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_token"
  ],
  "exposed_functions": [
    {
      "name": "assert_caller_is_collection_creator",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": []
    },
    {
      "name": "create",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": []
    },
    {
      "name": "get_art_data",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_collection::ArtData"
      ]
    },
    {
      "name": "get_collection",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::object::Object<0x4::collection::Collection>"
      ]
    },
    {
      "name": "get_collection_name",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::string::String"
      ]
    },
    {
      "name": "get_collection_owner_signer",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "signer"
      ]
    },
    {
      "name": "get_piece_data",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_collection::ArtData",
        "&0x1::string::String"
      ],
      "return": [
        "&0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_collection::PieceData"
      ]
    },
    {
      "name": "get_piece_description",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_collection::PieceData"
      ],
      "return": [
        "0x1::string::String"
      ]
    },
    {
      "name": "get_piece_name",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_collection::PieceData"
      ],
      "return": [
        "0x1::string::String"
      ]
    },
    {
      "name": "get_piece_uri",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_collection::PieceData"
      ],
      "return": [
        "0x1::string::String"
      ]
    },
    {
      "name": "is_creator",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_token_owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "&0x1::string::String"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "record_minted",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "0x1::string::String"
      ],
      "return": []
    },
    {
      "name": "set_art_data",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::string::String",
        "0x1::string::String",
        "0x1::string::String",
        "0x1::string::String"
      ],
      "return": []
    },
    {
      "name": "set_description",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::string::String"
      ],
      "return": []
    },
    {
      "name": "set_uri",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::string::String"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "ArtData",
      "is_native": false,
      "abilities": [
        "copy",
        "drop",
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "data",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, 0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30::nyc_collection::PieceData>"
        }
      ]
    },
    {
      "name": "CollectionRefs",
      "is_native": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "collection_mutator_ref",
          "type": "0x4::collection::MutatorRef"
        },
        {
          "name": "owner_extend_ref",
          "type": "0x1::object::ExtendRef"
        }
      ]
    },
    {
      "name": "PieceData",
      "is_native": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "token_name",
          "type": "0x1::string::String"
        },
        {
          "name": "token_description",
          "type": "0x1::string::String"
        },
        {
          "name": "token_uri",
          "type": "0x1::string::String"
        }
      ]
    },
    {
      "name": "TokenOwners",
      "is_native": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "owners",
          "type": "0x1::smart_table::SmartTable<address, vector<0x1::string::String>>"
        }
      ]
    }
  ]
} as const;

export const TOKEN_ABI = {
  "address": "0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30",
  "name": "nyc_token",
  "friends": [],
  "exposed_functions": [
    {
      "name": "fix_data",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0x4::token::Token>>"
      ],
      "return": []
    },
    {
      "name": "mint",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::string::String"
      ],
      "return": []
    },
    {
      "name": "mint_to",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::string::String",
        "address"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "TokenRefs",
      "is_native": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "mutator_ref",
          "type": "0x4::token::MutatorRef"
        },
        {
          "name": "piece_id",
          "type": "0x1::string::String"
        }
      ]
    }
  ]
} as const;
