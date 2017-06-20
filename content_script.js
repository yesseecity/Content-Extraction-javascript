function removeIframe(){
    var iframTags = document.getElementsByTagName('iframe');
    for(ifram of iframTags) {
        let inPreserveList = false;
        preserveList.iframe.forEach((preserve)=>{
            let re = new RegExp(preserve , 'i')
            if(re.test(ifram.src)){
                inPreserveList = true
            }
        });
        if (!inPreserveList) {
            ifram.remove()
        }
    }
}
function removeByClassName(className){
    while ( document.getElementsByClassName(className).length > 0) {
        document.getElementsByClassName(className)[0].remove();
        console.log(className+'.length: ',document.getElementsByClassName(className).length)
    }
}
function removeByTagName(tagName){
    while ( document.getElementsByTagName(tagName).length > 0) {
        document.getElementsByTagName(tagName)[0].remove();
        console.log(tagName+'.length: ',document.getElementsByTagName(tagName).length)
    }
}
function removeById(id){
    if (document.getElementById(id)) {
        document.getElementById(id).remove();
    }
}
function searchInAttr(keyword) {
    var body = document.body.innerHTML;
    var tmpClassList = [];
    var tmpIdList = [];
    var re1 = new RegExp('((class|id)=")((\\s|\\w|-)*'+keyword+'(\\s|\\w|-)*)(")', 'g');
    if (re1.test(body)){
        match1 = body.match(re1)

        match1.forEach((regExpMatch)=>{
            // console.log(regExpMatch);

            let re2 = new RegExp('((class|id)=")(.*)(")', 'g')
            // repalce = regExpMatch.replace(re2, "1:$1  2:$2  3:$3 4:$4")
            // console.log('>>', repalce)

            type = regExpMatch.replace(re2, "$2")

            listOfMatch = regExpMatch.replace(re2, "$3").split(' ')
            // console.log(listOfMatch)
            if (type == 'id'){
                // console.log('is id')
                tmpIdList = tmpIdList.concat(listOfMatch);
            } else if (type == 'class'){
                // console.log('is class')
                tmpClassList = tmpClassList.concat(listOfMatch);
            }
        })

        var idList = tmpIdList.filter((htmlId)=>{
            let re3 = new RegExp(keyword)
            return re3.test(htmlId)
        })
        var classList = tmpClassList.filter((htmlClass)=>{
            let re3 = new RegExp(keyword)
            return re3.test(htmlClass)
        })

        // console.log(idList)
        // console.log(classList)
        return {
            'id': idList,
            'class': classList
        };
    } else {
        return null
    }
}


removeList = {
    class:['Header', 'Footer', 'header', 'footer', 'topbar', 'ArticleList', 'links', 'banner', 'leaderboard', 'related', 'avatar'],
    id:['links', 'header', 'footer', 'banner', 'leaderboard', 'related'],
    tag:['script', 'iframe', 'header', 'footer', 'style', 'a'],
    other:['sidebar', 'list', 'link', 'ad', 'banner', 'related', 'lightbox', 'header', 'footer', 'social', 'fb', 'comment', 'copyright', 'pop', 'dialog']
}
preserveList = {
    iframe: ['youtube', 'vimeo', 'facebook']
}

for (v of removeList.class) {
    removeByClassName(v);
}
for (v of removeList.tag) {
    if(v == 'iframe') {
        removeIframe();
    } else {
        removeByTagName(v);
    }
}
for (v of removeList.id) {
    removeById(v);
}

for (v of removeList.other) {
    attr = searchInAttr(v)

    if(attr && attr.id.length>0) {
        attr.id.forEach((domId)=>{
            removeById(domId);
        })
    }

    if(attr && attr.class.length>0) {
        attr.class.forEach((className)=>{
            removeByClassName(className);
        })
    }
}
