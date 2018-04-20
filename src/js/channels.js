function deleteChannel(button){
    var name = button.parentNode.parentNode.id;
    $.post(`${location.origin}/query/delete_channel.php`, {"name":name} , function(data){
        document.location.replace( `${location.origin}/channels.php`); 
    })
}

function editChannel(button){
    var tr = button.closest('tr');
    var tdFullName = $('.td_full_name',tr)[0];
    var tdUrl = $('.td_url',tr)[0];
    var tdWindow = $('.td_window',tr)[0];
    var name = tr.id;

    tdFullName.innerHTML = `<input type="text" maxlength="50" value="${tdFullName.innerHTML}">`;
    tdUrl.innerHTML = `<input type="url" size="100px" value="${tdUrl.innerHTML}">`;
    
    $.get(`${location.origin}/query/windows_list.php`, function(data){
        tdWindow.innerHTML=data;
    })

    button.className = 'glyphicon glyphicon-floppy-saved';
    button.setAttribute('onclick',`saveChangesQuery(this,"${name}")`);     
}

function saveChangesQuery (button,oldName) {
    var tr = button.parentNode.parentNode;
    var tdFullName = tr.getElementsByClassName('td_full_name')[0];
    var tdUrl = tr.getElementsByClassName('td_url')[0];
    var tdWindow = tr.getElementsByClassName('td_window')[0];
    var fullName = tdFullName.getElementsByTagName('input')[0].value;
    var url = tdUrl.getElementsByTagName('input')[0].value;
    var n = tdWindow.getElementsByTagName('select')[0].options.selectedIndex;
    var windowNum = tdWindow.getElementsByTagName('select')[0].options[n].value;

    $.post(`${location.origin}/query/edit_channel.php`, 
        {"old_name":oldName,"full_name":fullName,"url":url,"window":windowNum,} , 
        function(data){
            saveChanges(button,'"'+this+'"');
        }
    )
}

function saveChanges (button,result) {  
    var tr = button.parentNode.parentNode;

    if(result.indexOf('done') != -1){
        tr.nextElementSibling.style.display = 'none';
        tr.nextElementSibling.innerHTML='';
        var tdFullName = tr.getElementsByClassName('td_full_name')[0];
        var tdUrl = tr.getElementsByClassName('td_url')[0];
        var tdWindow = tr.getElementsByClassName('td_window')[0];
        var fullName = tdFullName.getElementsByTagName('input')[0].value;
        var url = tdUrl.getElementsByTagName('input')[0].value;
        var n = tdWindow.getElementsByTagName('select')[0].options.selectedIndex;
        var windowNum = tdWindow.getElementsByTagName('select')[0].options[n].text;

        tdFullName.innerHTML=fullName;
        tdUrl.innerHTML=url;
        tdWindow.innerHTML=windowNum;
   
        button.className = 'glyphicon glyphicon-pencil';
        button.setAttribute('onclick','editChannel(this)');  
    }
    else {
        tr.nextElementSibling.style.display = 'table-row';
        tr.nextElementSibling.innerHTML='<td colspan="6">' + result.replace(/^"|"$/gm,'') + '</td>';
    }
    
}

