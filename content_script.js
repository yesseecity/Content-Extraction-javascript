// ECMAScript 6

var removeList = {
    class:['Header', 'Footer', 'header', 'footer', 'topbar', 'ArticleList', 'LinkList', 'links', 'banner', 'leaderboard', 'related', 'avatar', 'previous', 'next', 'feed', 'navbar', 'menu'],
    id:['links', 'header', 'footer', 'banner', 'leaderboard', 'related'],
    tag:['script', 'noscript', 'iframe', 'header', 'footer', 'style', 'a'],
    other:['list', 'link', 'sidebar', 'ad', 'banner', 'related', 'lightbox', 'header', 'footer', 'social', 'comment', 'copyright', 'pop', 'dialog', 'subscription', 'billboard', 'a2a' ,'author', 'navi', 'secondary']
};

// removeList.other = ['widget',  'ad', 'banner', 'related', 'lightbox', 'header', 'footer', 'social', 'comment', 'copyright', 'pop',  ]
// class: linkwithin
var preserveList = {
    class:['mark-links', 'post_list', 'with,sidebar','-,sidebar', 'image,popup', 'primary,secondary', 'lazyloaded', 'load', 'loaded', 'pad', 'category,banner'],
    iframe: ['youtube', 'vimeo', 'facebook', 'line']
};

function remover() {
    var removeIframe = function removeIframe(parentNode){
        var iframeTags = parentNode.getElementsByTagName('iframe');
        for(var i=1; i<iframeTags.length; i++) {
            let iframe = iframeTags[i];
            let inPreserveList = false;
            // preserveList.iframe.forEach((preserve)=>{
            //     let re = new RegExp(preserve , 'i');
            //     if(re.test(iframe.src)){
            //         inPreserveList = true;
            //     }
            // });
            for(let i = 0; i<preserveList.iframe.length; i++) {
                let preserve = preserveList.iframe[i];
                let re = new RegExp(preserve , 'i');
                if(re.test(iframe.src)){
                    inPreserveList = true;
                }
            }
            if (!inPreserveList) {
                iframe.remove();
            }
        }
    };
    var removeHyperlink = function removeHyperlink(parentNode){
        function process(hyperLink){
            for (let childrenNode in hyperLink.children){
                // console.log('tagName: ', childrenNode.tagName)
                // console.log('className: ', childrenNode.className)
                if(childrenNode.tagName != 'IMG') {
                    console.log('\t\tremove()');
                    childrenNode.remove();
                }
            }
        }

        for(let hyperLink in parentNode.getElementsByTagName('a')) {
            process(hyperLink);
        }
    };
    var removeByClassName = function removeByClassName(parentNode, className){
        while ( parentNode.getElementsByClassName(className).length > 0) {
            parentNode.getElementsByClassName(className)[0].remove();
            // console.log(className+'.length: ',parentNode.getElementsByClassName(className).length)
        }
    };
    var removeByTagName = function removeByTagName(parentNode, tagName){
        while ( parentNode.getElementsByTagName(tagName).length > 0) {
            parentNode.getElementsByTagName(tagName)[0].remove();
            // console.log(tagName+'.length: ',parentNode.getElementsByTagName(tagName).length)
        }
    };
    var removeById = function removeById(parentNode, id){
        if (parentNode.querySelector('#id')) {
            parentNode.querySelector(id).remove();
        }
    };
    var searchInAttr = function searchInAttr(parentNode, keyword) {
        var body = parentNode.innerHTML;
        var tmpClassList = [];
        var tmpIdList = [];
        var re1 = new RegExp('((class|id)=")((\\s|\\w|-)*'+keyword+'(\\s|\\w|-)*)(")', 'g');
        if (re1.test(body)){
            let match1 = body.match(re1);

            match1.forEach((regExpMatch)=>{
                let re2 = new RegExp('((class|id)=")(.*)(")', 'g');
                // replace = regExpMatch.replace(re2, "1:$1  2:$2  3:$3 4:$4")
                // console.log('>>', replace);

                type = regExpMatch.replace(re2, "$2");

                listOfMatch = regExpMatch.replace(re2, "$3").split(' ');
                // console.log(listOfMatch)
                if (type == 'id'){
                    // console.log('is id')
                    tmpIdList = tmpIdList.concat(listOfMatch);
                } else if (type == 'class'){
                    // console.log('is class')
                    tmpClassList = tmpClassList.concat(listOfMatch);
                }
            });

            var idList = tmpIdList.filter((htmlId)=>{
                var re3 = new RegExp(keyword);
                return re3.test(htmlId);
            });
            var classList = tmpClassList.filter((htmlClass)=>{
                var re3 = new RegExp(keyword);
                return re3.test(htmlClass);
            });

            var inPreserveList = false;
            classList.forEach((className, index)=>{
                // console.log(index, className)
                preserveList.class.forEach((pClassName)=>{
                    var allMatch = pClassName.split(',').every((element, index, array)=>{
                        var re = new RegExp(element);
                        return re.test(className);
                    });
                    if(allMatch) {
                        delete classList[index];
                    }
                });
            });

            // console.log('idList: ', idList)
            // console.log('classList: ', classList)
            return {
                'id': idList,
                'class': classList
            };
        } else {
            return null;
        }
    };

    return {
        "removeIframe": removeIframe,
        "removeHyperlink": removeHyperlink,
        "removeByClassName": removeByClassName,
        "removeByTagName": removeByTagName,
        "removeById": removeById,
        "searchInAttr": searchInAttr
    };
}

function removeProcess(parentNode) {
    var removeTool = remover();

    removeList.class.forEach(function (v) {
        removeTool.removeByClassName(parentNode, v);
    });
    removeList.tag.forEach(function (v) {
        if(v == 'iframe') {
            removeTool.removeIframe(parentNode);
        } else if (v == 'a') {
            removeTool.removeHyperlink(parentNode);
        } else {
            removeTool.removeByTagName(parentNode, v);
        }
    });
    removeList.id.forEach(function (v) {
        removeTool.removeById(parentNode, v);
    });
    removeList.other.forEach(function (v) {
        let attr = removeTool.searchInAttr(parentNode, v);

        if(attr && attr.id.length>0) {
            // attr.id.forEach((domId)=>{
            //     removeTool.removeById(parentNode, domId);
            // });
            for(let i=0; i < attr.id.length; i++) {
                let domId = attr.id[i];
                removeTool.removeById(parentNode, domId);
            }
        }

        if(attr && attr.class.length>0) {
            // attr.class.forEach((className)=>{
            //     removeTool.removeByClassName(parentNode, className);
            // });
            for(let i=0; i < attr.class.length; i++) {
                let className = attr.class[i];
                removeTool.removeByClassName(parentNode, className);
            }
        }
    });
}


var parentNode = document.body;
// parentNode = document.body.cloneNode(true);

removeProcess(parentNode);
var innerText = parentNode.innerText.trim();
var r1 = innerText.replace(/\n/g, '');
var r2 = r1.replace(/\s\s/g, '');