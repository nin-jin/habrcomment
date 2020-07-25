namespace $ {

	const { rem , per } = $mol_style_unit
	
	$mol_style_define( $my_habrcomment , {

		Orig: {
			flex: {
				grow: 1,
				shrink: 0,
				basis: per(50),
			},
		},
		
		Article: {
			maxWidth: rem(60),
		},
		
		Comments: {
			flex: {
				shrink: 0,
				grow: 1,
			},
		},

		Comments_empty: {
			padding: rem(1.5),
		},
		
	} )

}
