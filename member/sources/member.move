/*
/// Module: member
module member::member;
*/
module member::member;

use std::string::String;
use sui::{
    package,
    display,
};
use member::utils::to_b36;
use member::nft::{mint};

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
    members: vector<address>,
}

const EAlreadyJoined: u64 = 0;
const EUnauthorized: u64 = 1;

const EVENT_VISUALIZATION_SITE: address = @0x30e1a6f150d0bb70b3f96675a23de7ea95335a2501dd79d2453d62b9e1daab26;

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
    };
    vector::push_back(&mut state.events,event.id.to_inner());
    transfer::public_transfer(event,sender);
}

public entry fun join_event(event: &mut Event,link:String,image_url:String,description:String, ctx: &mut TxContext){
    let sender = ctx.sender();
    assert!(!vector::contains(&event.members,&sender),EAlreadyJoined);
    let nft = mint(event.name,link,image_url,description,ctx);
    vector::push_back(&mut event.members,sender);
    transfer::public_transfer(nft,sender);
}

public fun send_specific_nft(event:& Event,name:String,recipient:address,image_url:String,description:String, ctx: &mut TxContext){
    assert!(event.host == ctx.sender(),EUnauthorized);
    let nft = mint(name,event.b36addr,image_url,description,ctx);
    transfer::public_transfer(nft,recipient);
}




