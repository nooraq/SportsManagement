// @ is an alias to /src
import track from '@/directives/track';
import { postLogin } from '@/api/demo';

export default {
  name: 'home',
  directives: { track },
  components: {},
  data: () => ({
    username: 'admin',
    password: '123',
    wrong: false
  }),
  methods: {
    async login() {
      const userData = await postLogin({
        name: this.username,
        password: this.password
      }).catch(() => {
        this.wrong = true;
      });
      this.$store.commit('SET_USERDATA', userData);
      this.$router.push('/sys/projects');
    }
  }
};
