module member::nft;
use std::string::String;
use sui::{
    package,
    display,
};

public struct MemberNFT has key,store {
    id: UID,
    name: String,
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

public(package) fun mint(name:String,link:String,image_url:String,description:String, ctx: &mut TxContext):MemberNFT {   
    
    let nft = MemberNFT{
        id: object::new(ctx),
        name: name,
        link: link,
        image_url: image_url,
        description: description,
    };

    nft
}

public entry fun edit_description(nft: &mut MemberNFT, description: String){
    nft.description = description;
}

public fun get_member_id(nft: &MemberNFT): ID{
    nft.id.to_inner()
}

