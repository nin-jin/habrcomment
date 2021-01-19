namespace $.$$ {

	const Int = $mol_data_integer
	const Bool = $mol_data_boolean
	const Str = $mol_data_string
	const Maybe = $mol_data_nullable
	const Rec = $mol_data_record
	const List = $mol_data_array
	const Dict = $mol_data_dict

	const Moment = $mol_data_pipe( Str , $mol_time_moment )

	const Person = Rec({
		alias: Str,
		id: Str,
		login: Str,
		fullname: Maybe( Str ),
		avatarUrl: Maybe( Str ),
		speciality: Maybe( Str ),
	})

	const Comment =  Rec({
		id: Int,
		author: Maybe( Person ),
		children: List( Int ),
		isAuthor: Maybe( Bool ),
		isCanEdit: Maybe( Bool ),
		isFavorite: Maybe( Bool ),
		isNew: Maybe( Bool ),
		isPostAuthor: Maybe( Bool ),
		isSuspended: Maybe( Bool ),
		level: Int,
		message: Str,
		parentId: Int,
		score: Maybe( Int ),
		timeChanged: Maybe( Moment ),
		timeEditAllowedTill: Maybe( Moment ),
		timePublished: Maybe( Moment ),
		votesCount: Maybe( Int ),
	})
	
	const Comments_response = Rec({
		comments: Dict( Comment ),
		threads: List( Int ),
	})

	const Article = Rec({
		titleHtml: Str,
		textHtml: Str,
	})
	
	export class $my_habrcomment extends $.$my_habrcomment {

		article_id() {
			return Int( Number( this.$.$mol_state_arg.value( 'article' ) ) )
		}

		@ $mol_mem
		article_data() {
			const uri = `https://m.habr.com/kek/v2/articles/${ this.article_id() }`
			const data = Article( this.$.$mol_fetch.json( uri ) )
			return data
		}

		article_content() {
			return this.article_data().textHtml
		}

		title() {
			return this.article_data().titleHtml
		}

		orig_uri() {
			return `https://habr.com/post/${ this.article_id() }`
		}

		@ $mol_mem
		comments_data() {
			const uri = `https://m.habr.com/kek/v2/articles/${ this.article_id() }/comments/`
			const data = Comments_response( this.$.$mol_fetch.json( uri ) )
			return data
		}

		comment_message( id : number ) {
			return this.comments_data().comments[ id ].message
		}

		comment_avatar( id : number ) {
			
			let uri = this.comments_data().comments[ id ].author?.avatarUrl ?? ''
			
			if( uri === '//habr.com/images/stub-user-middle.gif' ) uri = ''
			if( !uri ) uri = '//habrastorage.org/getpro/habr/avatars/6c6/a92/518/6c6a925180e705e46c413d93f85c434b.png'
			
			return uri
		}

		comment_user( id : number ) {
			return this.comments_data().comments[ id ].author?.login ?? 'ufo'
		}

		comment_time( id : number ) {
			return this.comments_data().comments[ id ].timePublished as $mol_time_moment
				?? new $mol_time_moment
		}

		@ $mol_mem_key
		comments( id : number ) : $my_habrcomment_comment[] {
			return this.comments_visible( id ).map( id => this.Comment( id ) )
		}

		@ $mol_mem_key
		comments_all( id : number ) : readonly number[] {
			if( id === 0 ) return this.comments_data().threads
			return this.comments_data().comments[ id ].children
		}

		@ $mol_mem_key
		comments_visible( id : number ) : readonly number[] {

			if( this.comment_expanded( id ) ) {
				return this.comments_all( id )
			} else {
				return []
			}

		}

		@ $mol_mem_key
		comment_expanded( id : number , next? : boolean ) : boolean {
			if( next !== undefined ) return next
			return true
		}

		@ $mol_mem_key
		comment_expandable( id : number ) : boolean {
			return this.comments_all( id ).length > 0
		}

		root_comments() {
			return this.comments( 0 )
		}

		search_focus( event : Event ) {
			this.Search().Suggest().Filter().focused( true )
			event.preventDefault()
		}

		search( next? : string ) {
			return this.$.$mol_state_arg.value( 'search' , next ) ?? ''
		}

		image_uri( node : HTMLImageElement ) {
			return node.dataset.src || node.src || 'about:blank'
		}

	}

}
