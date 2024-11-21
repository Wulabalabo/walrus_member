module member::nft{

    use std::string::String;
    use sui::package;
    use sui::display;

    public struct MemberNFT has key,store {
        id: UID,
        name: String, //event name -> possible to change to eventID or event_obj_add
        link: String,
        image_url: String,
        description: String,
    }

        public struct WinnerNFT has key,store {
        id: UID,
        event: String,
        project: String,
        link: String,
        image_url: String,
        description: String,
    }


    public struct NFT has drop{}

    fun init(otw:NFT, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let publisher = package::claim(otw,ctx);

        let keys = vector[
            b"name".to_string(),
            b"link".to_string(),
            b"image_url".to_string(),
            b"description".to_string(),
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{link}".to_string(),
            b"{image_url}".to_string(),
            b"{description}".to_string(),
        ];

        let mut nft_display = display::new_with_fields<MemberNFT>(&publisher,keys,values,ctx);

        nft_display.update_version();
        transfer::public_transfer(publisher,sender);
        transfer::public_transfer(nft_display,sender);
    }

    public(package) fun mint_member(
        name: String,
        link: String,
        image_url: String,
        description: String, 
        ctx: &mut TxContext
    ): MemberNFT {   
        let nft = MemberNFT{
            id: object::new(ctx),
            name,
            link,
            image_url,
            description,
        };
        nft
    }

     public(package) fun mint_winner(
        event: String, 
        project: String,
        link: String, 
        image_url: String, 
        description: String, 
        ctx: &mut TxContext
    ): WinnerNFT {   
        let nft = WinnerNFT{
            id: object::new(ctx),
            event,
            project,
            link,
            image_url,
            description,
        };
        nft
    }

    public(package) fun mint_project_member(
        _winner: &WinnerNFT,

    ){
        //tbc
    }

    public fun get_member_id(nft: &MemberNFT): ID{
        nft.id.to_inner()
    }


    use sui::test_scenario::{Self};
    use std::string;
    #[test]
    fun test_get_member_id(){
        let user = @0xa;
        let mut scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;
        let name = string::utf8(b"bob");
        let link = string::utf8(b"link");
        let image_url = string::utf8(b"url");
        let desc = string::utf8(b"desc");
        let nft = mint_member(name, link, image_url, desc, test_scenario::ctx(scenario));
        let id = object::uid_to_inner(&nft.id);
        assert!(get_member_id(&nft) == id, 0);
        transfer::transfer(nft, user);
        test_scenario::end(scenario_val);
    }

}


