namespace $.$$ {

	export class $my_habrcomment_comment extends $.$my_habrcomment_comment {

		user_link() {
			return `https://habr.com/users/${ this.user_name() }/`
		}

		time_string() {
			return this.time().toString( 'YYYY-MM-DD hh:mm' )
		}

		sub() {
			return [
				... this.expandable() ? [ this.Expand() ] : [],
				this.Head(),
				this.Message(),
				this.Replies(),
			]
		}

	}

}
