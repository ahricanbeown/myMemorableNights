function YourPageInit(el) {
    this.pointer = el //保留元素对象

    this.el = document.querySelector(el.element) //保存装分页的盒子：<div> your-page
    this.el.setAttribute("onselectstart", "return false;")
    this.init() //默认启动
}



YourPageInit.prototype.init = function() {
    this.createPage() //创建分页标签，追加到盒子里面
    this.bindingPage() //绑定点击事件，切换分页页码
}

//绑定点击事件，切换分页页码
YourPageInit.prototype.bindingPage = function() {
    //1.判定点击的是谁
    this.el.onclick = (e) => {
        let eObj = e || window.event //兼容
        let target = eObj.target || eObj.srcElement //兼容
        let classNameArr = target.className.split(" ") //获取点击元素的class名
            // console.log("wobeidianji", classNameArr)
        let parentNameArr = target.parentNode.parentNode.className.split(" ");
        let val = target.innerText //获取点击页码内的“数字”
            //1.1如果我点击的页码
        if (classNameArr.indexOf("your-page-cell") !== -1) {
            this.pointer.currentPage = parseInt(val) //把当前页码的值给currentPage
                //因为只要点击页码 结构就可能会变动，所以这里调用this.createPage()方法
            this.createPage()
        }
        //我的样式会导致我点到字体
        else if (parentNameArr.indexOf("your-page-cell") !== -1) {
            this.pointer.currentPage = parseInt(val)
            this.createPage()
        }
        //2.如果是上下页面,更改当前页
        if (classNameArr.indexOf("your-page-prev") !== -1 || val == this.pointer.previousPage) {
            this.pointer.currentPage = this.pointer.currentPage - 1
            this.createPage()
        } else if (classNameArr.indexOf("your-page-next") !== -1 || val == this.pointer.nextPage) {
            this.pointer.currentPage = this.pointer.currentPage + 1
            this.createPage()
        }
        //3.如果是首页或者末页
        if (classNameArr.indexOf("your-page-first") !== -1 || val == this.pointer.firstPage) {
            this.pointer.currentPage = 1
            this.createPage()
        } else if (classNameArr.indexOf("your-page-last") !== -1 || val == this.pointer.lastPage) {
            this.pointer.currentPage = this.pointer.pages
            this.createPage()
        }
        //4.如果是跳转按钮
        if (classNameArr.indexOf("your-page-btns") !== -1) {
            // this.pointer.currentPage = 1
            // this.createPage()
            //转到 input框里面对应的value

            // let keycode = eObj.keyCode || eObj.which
            // console.log(keycode)
            let inputValue = this.el.querySelector(".your-page-input").value
            if (!(isNaN(Number(inputValue))) || Math.floor(inputValue) === inputValue) {
                if (0 < Number(inputValue) && Number(inputValue) <= this.pointer.pages) {
                    this.pointer.currentPage = parseInt(inputValue)
                    this.createPage()
                } else {

                    this.el.querySelector(".your-page-input").value = "hb,请输入有效页码"

                }


            } else {

                this.el.querySelector(".your-page-input").value = "hb,请输入有效页码"

            }


        }
    }
}


//创建分页标签，追加到盒子里面
YourPageInit.prototype.createPage = function() {
    let htmlStrArr = []
    for (let i = 0; i < this.pointer.pages; i++) {
        //创建页码
        htmlStrArr.push(`<li class="your-page-cell">${i + 1}</li>`)
    }
    //如果总页数大于每页的条数
    if (this.pointer.pages > this.pointer.everyPageSize) {
        //splice添加或者删除 返回值是被删除的那个哦  该方法会改变原始数组
        //该地方：index(删除项目的起始下标)，删除两个项目，在下标5 添加li标签:“...”
        htmlStrArr.splice(parseInt(this.pointer.everyPageSize) - 2, htmlStrArr.length - (parseInt(this.pointer.everyPageSize) - 1), "<li class='your-page-omit'>...</li>");
    }
    //数组转字符串 这样 可以写结构啦
    let htmlStr = htmlStrArr.join("")
        //把转好的htmlStr放在 ul里面  然后放在两个翅膀中间
    let pageHtmlStr = `<div class="your-page-first">${this.pointer.firstPage}</div>
    <div class="your-page-prev" class="sign-page">${this.pointer.previousPage}</div>
     <ul class="your-page-group">${htmlStr}</ul>
     <div class="your-page-next" class="sign-page">${this.pointer.nextPage}</div>
     <div class="your-page-last">${this.pointer.lastPage}</div>
     <input class="your-page-input" type="text" placeholder="输入页码跳转...">
     <div class="your-page-btns">${this.pointer.targetPage}</div>`;

    // 注入结构 因为带着标签呢 所以用innerHTML 把写好的结构放在 装分页的盒子.your-page 
    this.el.innerHTML = pageHtmlStr;
    //创建完，就禁用了；设置禁用
    this.forbiddenUpDown()

    //创建分页页码
    this.createYeMa()
}


//设置禁用function
YourPageInit.prototype.forbiddenUpDown = function() {
    //获取 上一页 和下一页的 标签
    let prveEl = document.querySelector(`${this.pointer.element} .your-page-prev`);
    let nextEl = document.querySelector(`${this.pointer.element} .your-page-next`);
    //如果当前页是 第一页
    if (this.pointer.currentPage === 1) {
        //就给他添加class名  
        // pointer-events: none;在css中禁用它
        prveEl.classList.add('your-page-forbid');
    } else {
        //如果不是还要移除呢
        prveEl.classList.remove('your-page-forbid');
    };
    //如果当前页就是最后一页
    if (this.pointer.currentPage === this.pointer.pages) {
        nextEl.classList.add('your-page-forbid');
    } else {
        nextEl.classList.remove('your-page-forbid');
    };
}

YourPageInit.prototype.createYeMa = function() {
    let page = parseInt(this.pointer.currentPage)
        //如果小于everyPageSize=7  pages > 7
    if (this.pointer.pages > this.pointer.everyPageSize) {
        let newEl = '';
        //当前页在第四页的时候。。。page <= 4
        if (page <= this.pointer.everyPageSize - 3) {
            // console.log("第一页怎么回事") //测试 点击第一页也触发了
            newEl = `
            <li class="your-page-cell">1</li>
            <li class="your-page-cell">2</li>
            <li class="your-page-cell">3</li>
            <li class="your-page-cell">4</li>
            <li class="your-page-cell">5</li>
            <li class="your-page-omit">...</li>
            <li class="your-page-cell">${this.pointer.pages}</li>`;
        } //需求：在第5个li ... && 在第3个li ...  点击需要切换
        //page代表我点击的页码 page >= 5 && page < pages - 3
        else if (page >= this.pointer.everyPageSize - 2 && page < this.pointer.pages - (this.pointer.everyPageSize - 4)) {
            newEl = `
            <li class="your-page-cell">1</li>
            <li class="your-page-omit">...</li>
            <li class="your-page-cell">${page-1}</li>
            <li class="your-page-cell">${page}</li>
            <li class="your-page-cell">${page + 1}</li>
            <li class="your-page-omit">...</li>
            <li class="your-page-cell">${this.pointer.pages}</li>`;
        } //满足这条件 就改结构page >= pages - 3
        else if (page >= this.pointer.pages - (this.pointer.everyPageSize - 4)) {
            newEl = `
            <li class="your-page-cell">1</li>
            <li class="your-page-omit">...</li>
            <li class="your-page-cell">${this.pointer.pages - 4}</li>
            <li class="your-page-cell">${this.pointer.pages - 3}</li>
            <li class="your-page-cell">${this.pointer.pages - 2}</li>
            <li class="your-page-cell">${this.pointer.pages - 1}</li>
            <li class="your-page-cell">${this.pointer.pages}</li>`;
        };

        //获取标签.加入结构=最后只满足一个结构newEl
        //模板字符拼接 .your-page .your-page-group  获取装页码的盒子 
        document.querySelector(`${this.pointer.element} .your-page-group`).innerHTML = newEl;
        // console.log("为什么没加进去") //测试：这里结构已经加进去了

        // 标注选中项
        //首先我获取 我们所有写着数字的li  （.your-page-cell是数字li们的class名）
        let pageCellELs = document.querySelectorAll(`${this.pointer.element} .your-page-cell`);
        //遍历这些标签
        //el=数字li标签
        pageCellELs.forEach(el => {
            //找到当前页和 数字li相对应的标签
            //如果当前页是第一页 我就给数字li=1的标签 添加classList名字 
            //毕竟className 赋值 可是会全覆盖 不管之前人家几个名字
            if (el.innerText == this.pointer.currentPage) {
                el.classList.add('your-page-checked');
            } else {
                //如果不是 我就移除他的 名字 ，不给他标注
                el.classList.remove('your-page-checked');
            };

        });
        this.pointer.callback && this.pointer.callback(this.pointer.currentPage);
    };
}