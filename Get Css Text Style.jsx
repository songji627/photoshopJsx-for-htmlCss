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
        var cssArr = getFontCss(contents,textAlign);
        var css = '';
        for(var i=0; i<cssArr.length; i++){
            var cssArrString = '';
            for(var key in cssArr[i]){
                if(cssArr[i][key] != '; '){
                    if(key =='content'){
                        cssArrString += cssArr[i][key];
                    }else{
                        cssArrString += key+":"+cssArr[i][key];
                    }
                }
            }
            css += cssArrString+'\n';
        }
        prompt('css',css);
    }else{
        alert("텍스트 레이어를 선택해주세요.");
    }
}
function getFontCss(contents, textAlign){  
    var ref = new ActionReference();  
    ref.putEnumerated(stringIDToTypeID('layer'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));  
    var desc = executeActionGet(ref);  
    var list =  desc.getObjectValue(charIDToTypeID('Txt '));  
    var tsr =  list.getList(charIDToTypeID('Txtt')) ;  
    var cssArr = new Array;  
    for(var i=0; i<tsr.count; i++){  
        var tsr0 =  tsr.getObjectValue(i);  
        var textStyle = tsr0.getObjectValue(charIDToTypeID('TxtS'));  
        var from = tsr0.getInteger(charIDToTypeID('From'));  
        var to = tsr0.getInteger(charIDToTypeID('T   '));  
        var content = contents.slice(from,to);
        content = content.replace(/\r/g, '').replace(/\n/g, '');
        var fontName = textStyle.getString(charIDToTypeID('FntN')) + '-' + textStyle.getString(charIDToTypeID('FntS'));   
        var fontSize = textStyle.getDouble(charIDToTypeID('Sz  '));  
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
            var letterSpacingEm = ((letterSpacing / 1000).toFixed(3));
            var letterSpacingPx = ((letterSpacing / 1000)*fontSize).toFixed(1);
            letterSpacingEm = ToFloat(letterSpacingEm);
            letterSpacingPx = ToFloat(letterSpacingPx);
            alert(letterSpacingPx)
            letterSpacing = letterSpacingEm+'em ' + letterSpacingPx +'px';
        }catch(e){
            var letterSpacing = 0;
        }
        try {
            var lineHeight = textStyle.getDouble(stringIDToTypeID('leading')); 
            lineHeightPer = (parseInt(lineHeight)/fontSize).toFixed(3);
            lineHeightPx = parseInt(lineHeight);
            lineHeightPer = ToFloat(lineHeightPer);
            lineHeightPx = ToFloat(lineHeightPx);
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
            fontWeight = '';
        }
        if(fontStyle == true){
            fontStyle = 'italic';
        }else{
            fontStyle = '';
        }      
        cssArr.push({
            'content':content+' { ', 
            'fontFamily':fontName+'; ', 
            'font-size':fontSize+'px; ', 
            'color':'#'+fontColor+'; ', 
            'font-weight':fontWeight+'; ',
            'font-style':fontStyle+'; ',
            'letter-spacing':letterSpacing+'; ', 
            'line-height':lineHeight+'; ',
            'text-align':textAlign+'; }'
        });  
    }  
    return cssArr;  
}  
function ToFloat(number){
    var tmp = number + "";
    if(tmp.indexOf(".") != -1){
        number = number.toFixed(4);
        number = number.replace(/(0+$)/, "");
    }
    return number;
}
init();
