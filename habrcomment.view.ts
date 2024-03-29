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
		fullname: Maybe( Str ),
		avatarUrl: Maybe( Str ),
		speciality: Maybe( Str ),
	})

	const Comment =  Rec({
		id: Str,
		author: Maybe( Person ),
		children: List( Str ),
		isAuthor: Maybe( Bool ),
		isCanEdit: Maybe( Bool ),
		isFavorite: Maybe( Bool ),
		isNew: Maybe( Bool ),
		isPostAuthor: Maybe( Bool ),
		isSuspended: Maybe( Bool ),
		level: Int,
		message: Str,
		parentId: Maybe( Str ),
		score: Maybe( Int ),
		timeChanged: Maybe( Moment ),
		timeEditAllowedTill: Maybe( Moment ),
		timePublished: Maybe( Moment ),
		votesCount: Maybe( Int ),
	})
	
	const Comments_response = Rec({
		comments: Dict( Comment ),
		threads: List( Str ),
	})

	const Article = Rec({
		titleHtml: Str,
		textHtml: Str,
	})
	
	export class $my_habrcomment extends $.$my_habrcomment {

		article_id() {
			return 423889
			// return Int( Number( this.$.$mol_state_arg.value( 'article' ) ) )
		}

		@ $mol_mem
		article_data() {
			// const uri = `https://m.habr.com/kek/v2/articles/${ this.article_id() }`
			const uri = `my/habrcomment/data/article.json`
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
			// const uri = `https://m.habr.com/kek/v2/articles/${ this.article_id() }/comments/`
			const uri = `my/habrcomment/data/comments.json`
			const data = Comments_response( this.$.$mol_fetch.json( uri ) )
			return data
		}

		comment_message( id : string ) {
			return this.comments_data().comments[ id ].message
		}

		comment_avatar( id : string ) {
			
			let uri = this.comments_data().comments[ id ].author?.avatarUrl ?? ''
			
			if( uri === '//habr.com/images/stub-user-middle.gif' ) uri = ''
			if( !uri ) uri = '//habrastorage.org/getpro/habr/avatars/6c6/a92/518/6c6a925180e705e46c413d93f85c434b.png'
			
			return uri
		}

		comment_user( id : string ) {
			return this.comments_data().comments[ id ].author?.alias ?? 'ufo'
		}

		comment_time( id : string ) {
			return this.comments_data().comments[ id ].timePublished as $mol_time_moment
				?? new $mol_time_moment
		}

		@ $mol_mem_key
		comments( id : string ) : $my_habrcomment_comment[] {
			return this.comments_visible( id ).map( id => this.Comment( id ) )
		}

		@ $mol_mem_key
		comments_all( id : string ) : readonly string[] {
			if( id === '' ) return this.comments_data().threads
			return this.comments_data().comments[ id ].children
		}

		@ $mol_mem_key
		comments_visible( id : string ) : readonly string[] {

			if( this.comment_expanded( id ) ) {
				return this.comments_all( id )
			} else {
				return []
			}

		}

		@ $mol_mem_key
		comment_expanded( id : string , next? : boolean ) : boolean {
			if( next !== undefined ) return next
			return true
		}

		@ $mol_mem_key
		comment_expandable( id : string ) : boolean {
			return this.comments_all( id ).length > 0
		}

		root_comments() {
			return this.comments( '' )
		}

		search_focus( event : Event ) {
			this.Search().Query().focused( true )
			event.preventDefault()
		}

		search( next? : string ) {
			return this.$.$mol_state_arg.value( 'search' , next ) ?? ''
		}

		image_uri( node : HTMLImageElement ) {
			return node.dataset.src || node.src || 'about:blank'
		}
		
		auto() {
			this.go_to_comment()
		}
		
		@ $mol_mem
		go_to_comment() {
			
			const id = this.$.$mol_state_arg.value( 'comment' )
			if( !id ) return null
			
			this.comments_data()
			
			const comment = this.Comment( id )
			new $mol_after_work( 50, ()=> this.ensure_visible( comment ) )
			
			return null
		}
		
		id( id: string ) {
			return id
		}

	}

}
