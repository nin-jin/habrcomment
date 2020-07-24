namespace $.$$ {

	export class $my_habrcomment_comment extends $.$my_habrcomment_comment {

		user_link() {
			return `https://habr.com/users/${ this.user_name() }/`
		}

		time_string() {
			return this.time().toString( 'YYYY-MM-DD hh:mm' )
		}

		head() {
			return [
				... this.expandable() ? [ this.Expand() ] : [],
				this.User_link(),
				this.Time(),
			]
		}

	}

}
