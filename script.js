axios.defaults.baseURL = 'https://news-at.zhihu.com/api/4/news';

var dldl = new Vue({
	el: '#dldl',
	data: {
		urlBase: 'https://daily.zhihu.com/story/',
		stories: [],
		date: '',
		pick: ''
	},
	computed: {
		dateFormat: function() {
			var frag = this.getFragment(this.date);
			if (new Date().getFullYear() == frag[0]) {
				return frag[1] + '月' + frag[2] + '日';
			} else {
				return frag[0] + '年' + frag[1] + '月' + frag[2] + '日';
			}
		},
		noMore: function() {
			var frag = this.getFragment(this.date);
			if (new Date().getFullYear() == frag[0] && 
				new Date().getMonth() + 1 == frag[1] &&
				new Date().getDate() == frag[2]) {
				return true;
			}
			return false;
		}
	},
	methods: {
		getLatest: function() {
			axios.get('/latest')
			.then(function(response) {
				dldl.stories = response.data.stories;
				dldl.date = response.data.date;
			})
			.catch(function(error) {
				console.log(error);
			});
		},
		getHistory: function(timestamp, flag) {
			if (!timestamp) return;
			var date = timestamp;
			if (flag) date = this.getForward(timestamp, flag);
			axios.get('/before/' + date)
			.then(function(response) {
				dldl.stories = response.data.stories;
				dldl.date = response.data.date;
			})
			.catch(function(error) {
				console.log(error);
			});
		},
		getFragment: function(str) {
			var y = str.substr(0, 4);
			var m = str.substr(4, 2);
			var d = str.substr(6, 2);
			return [y, m, d];
		},
		getForward: function(str, flag) {
			var format = this.getFragment(str).join('-');
			var date = new Date(format);
			date.setDate(date.getDate() + flag);
			var options = {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			};
			return date.toLocaleDateString('chinese', options).split('-').join('');
		}
	}
});

dldl.getLatest();