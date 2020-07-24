namespace $ {

	const { rem } = $mol_style_unit
	
	$mol_style_define( $my_habrcomment_comment , {

		minWidth: rem(22),

		User_name: {
			fontWeight : 'bold',
			padding: [ 0 , rem(.5) ],
		},
		
		User_link: {
			margin: [ 0 , rem(-.75) ],
			alignItems: 'baseline',
		},

		User_avatar: {
			width : rem(1.5),
			height : rem(1.5),
		},
		
		Time: {
			margin : [ rem(.5), rem(.75) ],
		},

		Expand: {
			position: 'absolute',
			margin: [ rem(.75) , rem(-.5) ],
			zIndex: 1,
		},
		
		Head: {
			padding: {
				top : rem(.75),
				left: rem(1.5),
				right: 0,
			},
			display: 'flex',
			flexWrap: 'wrap',
		},

		Message: {
			padding: {
				top : 0,
				left: rem(.75),
				right: 0,
			},
			maxWidth: rem(60),
		},
		
		Replies: {
			padding: { left : rem(1.5) },
		},
		
	} )

}
