const { createApp } = Vue;
let productModal = null;
let delModal = null;

createApp({
  data() {
    return {
      checkStatus: true,
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "lisashark",
      // 產品資料格式
      products: [],
      //出現詳細產品頁
      showProduct: {},
      showActive: 0,

      //編輯新增刪除彈窗
      modalData: {
        isModoal: false,
        whatModal: "", //addNew,edit,delete
        title: "",
        showPicBtn: false,
        productID: "",
      },

      //彈窗商品資料
      tempProductData: {
        id: "",
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "",
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
        imagesUrl: [],
        addPicLink: null,
      },
    };
  },
  methods: {
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
          this.checkStatus = false;
        })
        .catch((error) => {
          console.dir(error);
          location.href = "./login.html";
        });
    },
    logout() {
      axios.defaults.headers.common["Authorization"] = "";
      document.cookie = `hexToken='';`;
      axios
        .post(`${this.url}/logout`)
        .then((res) => {})
        .catch((error) => {
          console.dir(error);
          location.href = "./login.html";
        });
    },
    getProduct() {
      axios
        .get(`${this.url}/api/${this.path}/admin/products/all`)
        .then((res) => {
          this.products = Object.values(res.data.products);
          console.log(this.products);
          this.products.forEach((element) => {
            console.log(element.imagesUrl);
          });
          this.products.forEach((element) => {
            console.log(element.imageUrl);
          });
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    detailBtn(item) {
      this.showProduct = item;
      this.showActive = 1;
    },

    clearTempdata() {
      this.tempProductData = {
        id: "",
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "",
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
        imagesUrl: [],
        addPicLink: null,
      };
    },
    openModal(name, item) {
      this.modalData.whatModal = name;
      this.modalData.isModoal = true;
      this.clearTempdata();

      switch (name) {
        case "addNew":
          this.modalData.title = "新增產品";
          this.modalData.showPicBtn = false;
          productModal.show();
          break;
        case "edit":
          console.log(item);
          this.modalData.title = "修改產品";
          this.tempProductData.id = item.id;
          this.tempProductData.title = item.title;
          this.tempProductData.category = item.category;
          this.tempProductData.origin_price = item.origin_price;
          this.tempProductData.price = item.price;
          this.tempProductData.unit = item.unit;
          this.tempProductData.description = item.description;
          this.tempProductData.content = item.content;
          this.tempProductData.is_enabled = item.is_enabled;
          this.tempProductData.imageUrl = item.imageUrl;
          console.log(item.imagesUrl);
          this.tempProductData.imagesUrl = item.imagesUrl
            ? [...item.imagesUrl]
            : [];
          productModal.show();
          console.log(this.tempProductData);
          break;
        case "delete":
          this.tempProductData.id = item.id;
          this.tempProductData.title = item.title;
          delModal.show();
          break;
        default:
          console.log("玩了寫錯啦QQ~~~");
      }
    },

    //刪除圖片
    delPic(index) {
      this.tempProductData.imagesUrl.splice(index, 1);
    },
    //新增圖片
    addPic(newLink) {
      this.tempProductData.imagesUrl.push(newLink);
      this.tempProductData.addPicLink = "";
    },
    //寫入商品資料
    writeProduct() {
      const dataSet = {
        data: {
          title: this.tempProductData.title,
          category: this.tempProductData.category,
          origin_price: this.tempProductData.origin_price,
          price: this.tempProductData.price,
          unit: this.tempProductData.unit,
          description: this.tempProductData.description,
          content: this.tempProductData.content,
          is_enabled: this.tempProductData.is_enabled,
          imageUrl: this.tempProductData.imageUrl,
          imagesUrl: this.tempProductData.imagesUrl,
        },
      };
      //新增
      if (this.modalData.whatModal == "addNew") {
        axios
          .post(`${this.url}/api/${this.path}/admin/product`, dataSet)
          .then((res) => {
            console.log(res);
            alert("成功新增!");
            this.getProduct() ;
            productModal.hide();
          })
          .catch((error) => {
            console.dir(error);
          });
      }
      //修改
      else if (this.modalData.whatModal == "edit") {
        axios
          .put(
            `${this.url}/api/${this.path}/admin/product/${this.tempProductData.id}`,
            dataSet
          )
          .then((res) => {
            console.log(res);
            alert("成功修改!");
            this.getProduct();
            productModal.hide();
          })
          .catch((error) => {
            console.dir(error);
          });
      }
    },

    //刪除商品
    delProduct(id) {
      axios
        .delete(`${this.url}/api/${this.path}/admin/product/${id}`)
        .then((res) => {
          console.log(res);
          alert("成功刪除!");
          this.getProduct();
          delModal.hide();
        })
        .catch((error) => {
          console.dir(error);
        });
    },
  },
  mounted() {
    this.checkLogin();
    this.getProduct();

    //實例化modal
    productModal = new bootstrap.Modal(
      document.getElementById("popupModal"),
      { backdrop: "static" }
    );
    delModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );
  },
  watch: {
    "modalData.showPicBtn": function () {
      modalData.showPicBtn =
        this.tempProductData.imagesUrl.length > 0 ? ture : false;
    },
  },
}).mount("#app");