# 百田网开发及维护

在百田，呆的最长时间的，莫过于pja，百田网项目了。
期间，第一年，主要以学习为主。
从实习开始说起，大约2012/03中左右，进入了百田...

## 入职前半年

跟着师傅聂云恩，学习了两个月的前端，
开始几乎从零开始，学习cms，学习样式，学习图片sprite，开始学习jq如何使用。

### 阳光星球

记得第一个独立完成的官网，叫做阳光星球【呃，第一期没有上，那时候还很幼稚，图片合并神马的，有考虑过吗？
第二期上线，是基于第一期cms配置而开发的。
样式开始重新，也尝试独自编写脚本。

后来，第二期阳光星球上线了【现在还在运营】，但师傅就辞职跑了，他告诉我说，这里太辛苦了，我一直不明白为什么，直到我也离职了。

**学习经验：**

 1. 学会了css的雪碧图
 2. 终于知道css背景，是左上角为起点计算的了
 3. 开始学习jquery选择器，动画

### 知了


说是站点嘛，其实我就维护其中的一个模块，好像是什么知了问答的。主要是cms模块的配置，jsp的生成之类的。
其实它整个站点都已经搭建完成了，师傅走后，就落到了我手上维护。
不得不说，这是一个混乱的站点【直到我离开，也每人动手再次重构了吧？】

**学习经验：**

 1. 开始了解一些简单的jsp语法，至少取值、设值
 2. 明白了，模块化的重要【他喵的，完全无法下手重构啊】

### 官网制作维护

期间做了很多官网的维护，主要也就让我更加属性jq和当一个勤劳的cms维护工人。

**学习经验:**

 1. 了解了，原来生成静态页面的ftl，是一门叫freemaker的语言
 2. 学习freemaker的语法，取值等


## 入职半年到一年

这期间，终于开始接受独立的站点了，其中记忆最深刻的，莫过于视频站点了。

### 涂鸦板

嗯，记得这时候，有位新入职的同学，叫朱玉韵，
当初我还是比较水的，就已经叫我去带新人，感觉鸭梨山大的说。
对了，这个站点，一开始就很不负责任的扔了给他，想想自己还挺混蛋的。

**学习经验：**

 1. 了解了什么叫瀑布流布局，并实现了坑爹的三列布局，权当暂时的瀑布流吧。
 2. 这时候，一般jq选择，已经完得很溜了。

### 视频站点

对了，其实视频站点，已经被关闭掉了，其实我觉得是一个挺有发展前景的站点。
不过因为公司关系不够硬，最终没有网络视频许可，被迫关闭了。

**学习经验:**

 1. 开始接触异步加载的类库，其实就是in.js了，一个迷你但功能强大的前端类库
 2. 模仿光耀同学的代码，结合自己看的书籍，开始编写模块化的代码【嗯，把光耀同学刺激得够呛的，后来他也发奋图强了。】
 3. 开始学习如何划分站点板块，分工合作【第一次跟其他人合作，想想也好激动的说~】
 4. 开始喜欢自己编写公用的板块，以后使用了，但是，这个站点的板块，其实编得挺烂的，后来也没有更多的重用- =！！！

## 一年到一年半

好吧，这时候，我就是个论坛狂魔，整个人都是圈圈的了。

### 圈圈

跟古飞同学，没日没夜的赶工圈圈的新版，我记得我们加班加点，做了3周，最后测了差不多2周，才上线
坑爹的光耀同学，看着我一个人累死累活的，也不吭声，当个透明人
不过，谁叫我当初那么傻呢，自作孽，不可活也。

**学习经验：**

 1. 第一次正式跟后端配合，好激动啊~，前后端的思维，真心相差好大
 2. 这时候，才真正学习ajax请求，终于分清get和post的使用场景了【Get请求不转意就是坑爹的货~
 3. 开始接触富文本编辑器【ueditor】，功能好强大的说【后来模仿写一个，失败了~，没恒心】
 4. 第一次使用类似继承的模仿，编写板块
 5. In.js的使用，已经泛滥了~
 6. 模块编写，慢慢溜起来了
 7. 终于有外部可以重用的代码了【那个功能超复杂的弹窗.....】

### 官网公用评论

当初，那圈产品也坑爹的，想给所有文章下，添加一个评论板块。
当初我是拒绝的，后来也没辙了。
但是，光耀同学留了个iframe在每个文章下面，当作评论。
也知道，iframe如果有一些弹窗什么的交互，那就坑爹了嘛~，
SO，改呗~

**学习经验：**

 1. 了解如何跨域请求，垮父子域的方法，用得好溜啦
 2. 开始使用正则
 3. 前后端过多的约定，真的会很坑爹
 4. 好多多此一举的工厂函数
 5. 过多的配置，神烦
 6. ie6太多的padding+margin一起使用，会坑爹哦~

## 一年半到两年

这段时间，就是大大小小，活动不断，有种产品脑抽了的感觉。
期间，什么游戏周年庆，什么涂鸦作品展，圈圈你的xx什么的活动，
反正洪水泛滥似的，挡也挡不住。

**学习经验：**
 
 1. 公用模块真的很重要，开始各种编写活动能重用的板块
 2. 什么简单评论的，如雨后春笋，层出不穷。
 3. 重复劳动活，好烦的说~

这半年来，性子都被磨没了，没日没夜的工作，真心不爱。

## 两年到两年半

这时候，很坑爹的，竟然让我做做安卓开发。
好吧，刚开始，我是答应给他们写样式的，可后来为什么连代码都需要俺写了哇？ 
这是我在百田最无语的一段期间，觉得简直是莫名其妙的。

**学习经验：**

 1. 有个好老师，真的很重要
 2. 重温了java代码的基本写法
 3. 体验了后端代码编写的风格，和思维

## 两年半到三年

这完全是堕落的时期，刚开始，剑平让我们搞h5，兴致还是挺高的。
给他们做了一个chrome的下载资源的插件，研究了微信的分享，授权神马的。
后来，少如同学回来后，感觉整个风格都变了。

没日没夜的修改游戏，没有原创的乐趣，改个皮肤，就当新的产品。
我已经无话可说了......
挂，应该是它最后的结果。
后来我调部门后，整个平台没多久就被合并了。
没有一个好产品，再好的开发，也是白搭。

**学习经验：**
 
 1. 人终究比不上机器、软件，一块合适的开发工具，不仅仅只是事半功倍而已
 2. 你认为很好的东西，别人可能看不上~，看开点，青年
 3. 手机端的游戏开发，遇到sb产品，就是个无休止的坑
 4. 自适应什么的，其实超简单的说...

## 最后那两个月

虽然cto暂时把我调到了新部门，但是，其实我也没多强烈的继续留下的意愿。
不过，工作需要，也给它们搭起了一个后台的框架。
其中，我的思想很简单，就是分板块开发，方便前端维护。

不过道不同不相为谋，大家都认为后端更改超不方便，为什么装个node.js就这么难呢？
好吧，最后我也不强求，不喜欢分板块，就给我都合到一起去吧。反正我已经没辙了。

**学习总结：**
 
 1. 前后端一致的环境，是绝对必要的
 2. 尽量傻瓜式操作，果然fis才是懒人该用的东西啊【不过，我还是坚持，能自己动手的，就动手，机会不多
 3. 抓紧时间，完成后面的工作吧，产品们丧心病狂起来，不是人
 4. 别答应没休没止的改BUG，最好新工作时，完全不改BUG，改起来，就没完没了的


## 最后

百田，让我从一个一无是处的菜鸟，变成了一个有点用的菜鸟，
一直挺感谢大家的栽培和照顾的。

不过它的松散制度，并不合适我，
严格的制度，高效的团队，才是我的追求。
