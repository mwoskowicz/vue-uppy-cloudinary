webpackJsonp([2],{102:function(e,t){},103:function(e,t){},137:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;return(e._self._c||t)("button",{class:[e.buttonStyle],on:{click:e.openUploader}},[e._v("\n\n  "+e._s(e.buttonText)+"\n")])},staticRenderFns:[]}},34:function(e,t,a){function n(e){a(103)}var o=a(52)(a(58),a(137),n,"data-v-085860d1",null);e.exports=o.exports},56:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(34),o=a.n(n);t.default=o.a},58:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(59),o=a.n(n),r=a(98),i=a.n(r),u=a(61),s=a.n(u),l=a(113),p=a.n(l),d=a(120),c=a.n(d),f=a(133),m=a.n(f),y=a(102);a.n(y);t.default={props:{cloudName:{type:String,required:!0},buttonText:{type:String,default:"Upload"},minNumberOfFiles:{type:Number,default:1},maxNumberOfFiles:{type:Number,default:10},maxFileSize:{type:Number,default:4e7},allowedFileTypes:{type:Array,default:function(){return["image/*","video/*"]}},autoProceed:{type:Boolean,default:!1},showProgressDetails:{type:Boolean,default:!0},closeModalOnClickOutside:{type:Boolean,default:!0},buttonStyle:{type:String,default:"uploader"},signRequest:{type:Function},options:{type:Object,required:!0}},data:function(){return{uppy:{}}},mounted:function(){this.uppy=this.createUppyInstance(),this.uppy.on("complete",this.completeHandler)},methods:{openUploader:function(){this.uppy.getPlugin("Dashboard").openModal()},uploadFile:function(e,t){var a=this,n=new FormData,o=new XMLHttpRequest;n.append("file",e.data),this.appendFormDataParams(n,t),o.upload.addEventListener("loadstart",function(){a.uppy.emit("upload-started",e.id)}),o.addEventListener("load",function(t){200===t.target.status?(a.$emit("uploaded",JSON.parse(t.target.response)),a.uppy.emit("upload-success",e.id)):a.uppy.emit("upload-error",e.id,new Error("Failed to upload"))}),o.addEventListener("error",function(){a.uppy.emit("upload-error",e.id,new Error("Failed to upload"))}),o.upload.addEventListener("progress",function(t){if(t.lengthComputable){var n={uploader:a,id:e.id,bytesUploaded:t.loaded,bytesTotal:t.total};a.uppy.emit("upload-progress",n),a.$emit("upload-progress",n)}}),o.open("POST","https://api.cloudinary.com/v1_1/"+this.cloudName+"/auto/upload"),o.send(n)},createUppyInstance:function(){return p()({autoProceed:this.autoProceed,restrictions:{maxFileSize:this.maxFileSize,maxNumberOfFiles:this.maxNumberOfFiles,minNumberOfFiles:this.minNumberOfFiles,allowedFileTypes:this.allowedFileTypes}}).use(c.a,{target:"body",showProgressDetails:this.showProgressDetails,closeModalOnClickOutside:this.closeModalOnClickOutside}).use(m.a,{target:c.a}).run()},completeHandler:function(e){var t=this;s()(i.a.mark(function a(){var n,o;return i.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(n=null,"upload"===t.options.type){a.next=6;break}return a.next=4,t.signRequest(t.options);case 4:o=a.sent,n=o.data;case 6:e.successful.forEach(function(e){t.uploadFile(e,n||t.options)});case 7:case"end":return a.stop()}},a,t)}))()},appendFormDataParams:function(e,t){o()(t).forEach(function(a){e.append(a,t[a])})}}}}},[56]);