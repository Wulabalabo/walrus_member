/*
/// Module: member
module member::member;
*/
module member::member{

    use std::string::String;
    use sui::package;
    use sui::display;
    use member::utils::to_b36;
    use member::nft::{mint_member, mint_winner};

    public struct State has key, store {
        id:UID,
        events: vector<ID>,
    }

    public struct Event has key, store{
        id:UID,
        name: String,
        host: address,
        image_url: String,
        b36addr:String,
        description: String,
        members: vector<address>, //user nft
        winners: vector<address>, //project nft
    }

    const EAlreadyJoined: u64 = 0;
    const EUnauthorized: u64 = 1;
    const EGeneric: u64 = 2;

    const EVENT_VISUALIZATION_SITE: address = @0x2;

    public struct MEMBER has drop {}

    public struct AdminCap has key, store{
        id:UID,
    }

    fun init(otw:MEMBER, ctx: &mut TxContext){

        let sender = ctx.sender();
        let publisher = package::claim(otw,ctx);

        let keys = vector[
            b"link".to_string(),
            b"image_url".to_string(),
            b"description".to_string(),
            b"walrus site address".to_string(),
        ];  

        let values = vector[
            b"https://{b36addr}.walrus.site".to_string(),
            b"{image_url}".to_string(),
            b"{description}".to_string(),
            EVENT_VISUALIZATION_SITE.to_string(),
        ];  

        let mut display = display::new_with_fields<Event>(&publisher,keys,values,ctx);
        display.update_version();
        
        let state = State{
            id: object::new(ctx),
            events: vector::empty<ID>(),
        };

        let admin_cap = AdminCap{
            id: object::new(ctx),
        };

        transfer::public_transfer(display,sender);
        transfer::public_transfer(admin_cap,sender);
        transfer::public_transfer(publisher,sender);
        transfer::public_share_object(state);
    }

    public entry fun create_event(_admin:&AdminCap, state: &mut State,name:String,image_url:String,description:String, ctx: &mut TxContext){
        let sender = ctx.sender();
        let id = object::new(ctx);
        let object_address = object::uid_to_address(&id);
        let b36addr = to_b36(object_address);
        let event = Event{
            id: id,
            name: name,
            image_url: image_url,
            b36addr: b36addr,
            description: description,
            members: vector::empty<address>(),
            host: sender,
            winners: vector::empty<address>(),
        };
        vector::push_back(&mut state.events,event.id.to_inner());
        transfer::public_transfer(event,sender);
    }

    public entry fun join_event(event: &mut Event,image_url:String,description:String, ctx: &mut TxContext){
        let recipient = ctx.sender();
        send_member_nft_inner(event, image_url, description, recipient, ctx);
    }

    public entry fun send_winning_nfts(
        _admin:&AdminCap, 
        event: &mut Event, 
        recipients: vector<address>, 
        projects: vector<String>,
        image_urls: vector<String>,
        descriptions: vector<String>,
        ctx: &mut TxContext,
    ){
        let size = vector::length(&recipients);
        assert!(
            (vector::length(&projects) == size) && 
            (vector::length(&image_urls) == size) &&
            (vector::length(&descriptions) == size),
        2);
        let mut i = 0;
        while(i < size){
            send_winning_nft_inner(
                event, 
                *vector::borrow(&recipients, i),
                *vector::borrow(&projects, i),
                *vector::borrow(&image_urls, i),
                *vector::borrow(&descriptions, i),
                ctx
            );
            i = i + 1;
        };
    }

    public fun send_specific_nft(
        _admin:&AdminCap, 
        event: &mut Event, 
        recipient:address, 
        image_url:String, 
        description:String, 
        ctx: &mut TxContext
    ){
        send_member_nft_inner(event, image_url, description, recipient, ctx);
    }

    fun send_winning_nft_inner(
        event: &mut Event, 
        recipient: address,
        project: String,
        image_url: String,
        description: String,
        ctx: &mut TxContext
    ){
        assert!(!vector::contains(&event.winners, &recipient));
        let nft = mint_winner(event.name, project, event.b36addr, image_url, description, ctx);
        vector::push_back(&mut event.winners, recipient);
        transfer::public_transfer(nft,recipient);
    }

    fun send_member_nft_inner(
        event: &mut Event,
        image_url: String,
        description: String, 
        recipient: address,
        ctx: &mut TxContext
    ){
        assert!(!vector::contains(&event.members,&recipient),EAlreadyJoined);
        let nft = mint_member(event.name,event.b36addr,image_url,description,ctx);
        vector::push_back(&mut event.members,recipient);
        transfer::public_transfer(nft,recipient);
    }

}

