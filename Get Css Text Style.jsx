function init(){
    var currentLayer = app.activeDocument.activeLayer; 
    if(currentLayer.kind == 'LayerKind.TEXT'){
        var contents = currentLayer.textItem.contents;
        try{
            var textAlign = String(currentLayer.textItem.justification);
        }catch(e){
            var textAlign = 'left';
        }
        textAlign = textAlign.replace('Justification.','').toLowerCase();
        var cssArr = getCss(contents,textAlign);
        cssArr = uniqArr(cssArr);
        var css = '';
        for(i=0; i<cssArr.length; i++){
            var stringContent = cssArr[i].content.replace(/\s/g, '');
            if(stringContent != ''){
                var cssArrString = '';
                for(var key in cssArr[i]){
                    if(key =='content'){
                        cssArrString += cssArr[i][key]+'\n';
                    }else{
                        cssArrString += key+":"+cssArr[i][key];
                    }
                }
                css += cssArrString+'\n\n';
            }
        }
        if(css.length > 255){
            longPrompt(css);
        }else{
            prompt('ctrl+c',css);
        }
    }else{
        alert("텍스트 레이어를 선택해주세요.");
    }
}
function getCss(contents, textAlign){  
    var ref = new ActionReference();  
    ref.putEnumerated(stringIDToTypeID('layer'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));  
    var desc = executeActionGet(ref);  
    var list =  desc.getObjectValue(charIDToTypeID('Txt '));  
    var tsr =  list.getList(charIDToTypeID('Txtt')) ;  
    var desc1 = desc.getObjectValue(stringIDToTypeID('textKey'));  
    var mFactor = 1;
    if (desc1.hasKey(stringIDToTypeID('transform'))) {  
        mFactor = desc1.getObjectValue(stringIDToTypeID('transform')).getUnitDoubleValue (stringIDToTypeID("yy") );  
    }  
    var cssArr = new Array;  
    for(var i=0; i<tsr.count; i++){  
        var tsr0 =  tsr.getObjectValue(i);  
        var textStyle = tsr0.getObjectValue(charIDToTypeID('TxtS'));  
        var from = tsr0.getInteger(charIDToTypeID('From'));  
        var to = tsr0.getInteger(charIDToTypeID('T   '));  
        var content = contents.slice(from,to);
        var fontName = textStyle.getString(charIDToTypeID('FntN')) + '-' + textStyle.getString(charIDToTypeID('FntS'));   
        var fontSize = textStyle.getDouble(charIDToTypeID('Sz  '));  
        fontSize *= mFactor;
        fontSize = Math.round(fontSize);
        try {
            var color = textStyle.getObjectValue(charIDToTypeID('Clr '));  
            var textColor = new SolidColor;  
            textColor.rgb.red = color.getDouble(charIDToTypeID('Rd  '));  
            textColor.rgb.green = color.getDouble(charIDToTypeID('Grn '));  
            textColor.rgb.blue = color.getDouble(charIDToTypeID('Bl  '));
            var fontColor = textColor.rgb.hexValue;
        }catch(e){
            var fontColor = '000';
        }
        try {
            var letterSpacing = textStyle.getDouble(stringIDToTypeID('tracking')); 
            var letterSpacingEm = (letterSpacing / 1000).toFixed(3);
            var letterSpacingPx = Math.round((letterSpacing / 1000)*fontSize);
            letterSpacingEm = Number(letterSpacingEm);
            letterSpacingPx = Number(letterSpacingPx);
            letterSpacing = letterSpacingEm+'em ' + letterSpacingPx +'px';
        }catch(e){
            var letterSpacing = 0;
        }
        try {
            var lineHeight = textStyle.getDouble(stringIDToTypeID('leading')); 
            lineHeight *= mFactor;
            lineHeightPer = (lineHeight/fontSize).toFixed(3);
            lineHeightPx = Math.round(lineHeight);
            lineHeightPer = Number(lineHeightPer);
            lineHeightPx = Number(lineHeightPx);
            lineHeight = lineHeightPx+'px ' + lineHeightPer;
        }catch(e){
            var lineHeight = 0;
        }
        try {
            var fontWeight = textStyle.getBoolean(stringIDToTypeID('syntheticBold'));
        }catch(e){
            var fontWeight = false;
        }
        try {
            var fontStyle = textStyle.getBoolean(stringIDToTypeID('syntheticItalic'));
        }catch(e){
            var fontStyle = false;
        }
        if(fontWeight == true){
            fontWeight = 'bold';
        }else{
            fontWeight = 'normal';
        }
        if(fontStyle == true){
            fontStyle = 'italic';
        }else{
            fontStyle = 'normal';
        }     
        cssArr.push({
            'content':content.replace(/\r/g, '').replace(/\n/g, ''), 
            '{ font-size':fontSize+'px; ', 
            'letter-spacing':letterSpacing+'; ', 
            'line-height':lineHeight+'; ',
            'color':'#'+fontColor+'; ', 
            'font-weight':fontWeight+'; ',
            'font-style':fontStyle+'; ',
            'font-family':fontName+'; ', 
            'text-align':textAlign+'; }'
        });  
    }  
    return cssArr;  
}
function uniqArr(arr) {
    var chk = [];
    for(var i = 0; i < arr.length; i++){
        if(chk.length == 0){
            chk.push(arr[i]);
        }else{
            var flg = true;
            for(var j = 0; j < chk.length; j++){
                if(chk[j].content == arr[i].content){
                    for(var keyArr in arr[i]){
                        for(var keyChk in chk[j]){
                           if( arr[i][keyArr] != chk[j][keyChk]){
                              flg = true;
                              break;
                           }
                        }
                    }
                    flg = false;
                    break;
                }
            }
            if(flg){
                chk.push(arr[i]);
            }
        }
    }
    return chk;
}
function longPrompt(myCitation) {  
    var winRes = "dialog {   preferredSize: [550,150],   alignChildren: ['fill', 'top'],    orientation: 'column',    text: 'CSS',    titleText: StaticText {},    citationText: EditText { preferredSize: [200, 100], properties: {multiline: true, scrolling: true } },   buttonsGroup: Group {       orientation: 'row',  alignChildren: ['center', 'top'], confirmButton: Button { text: 'Ok' }   }  }"  
    var w = new Window(winRes);  
    w.titleText.text = 'ctrl+a , ctrl+c';
    w.citationText.text = myCitation || "코드 없음"  
    w.citationText.active =true;
    w.show();  
}  
init();
