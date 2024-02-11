const { createApp } = Vue;
createApp({
  data() {
    return {
      emailInput: "",
      pwInput: "",
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "lisashark",
    };
  },
  methods: {
    validate(){},
    login() {
      const userData = {
        username: this.emailInput,
        password: this.pwInput,
      };
      axios
        .post(`${this.url}/admin/signin`, userData)
        .then((res) => {
          console.log(res);
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(
            expired
          )};`;
          location.href = "./product.html";
        })

        .catch((error) => {
          console.dir(error);
          alert("請再次確認您的帳密");
        });
    },
    checkLogin() {
      let token = "";
      if (document.cookie.search("hexToken") >= 0) {
        token = document.cookie
          .split(";")
          .find((item) => item.search("hexToken") >= 0)
          .split("=")[1];
        axios.defaults.headers.common["Authorization"] = token;
      }

      axios
        .post(`${this.url}/api/user/check`)
        .then((res) => {
          console.log(res);
          location.href = "./product.html";
        })
        .catch((error) => {
          console.dir(error);
        });
    },
  },
  mounted() {
    this.checkLogin();
  },
}).mount("#app");