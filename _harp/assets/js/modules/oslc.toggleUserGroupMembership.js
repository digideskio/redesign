$(document).ready(function(){

// this is set in the EE template
var options = window.toggleMembershipOptions;

if (! options) {return;}

// sugar
var
  catID = options.workgroupCategory,
  isMember = options.isWorkgroupMember,
  getValue = function() { return $(this).val(); };


$.ajax({
  url: options.changeMembershipFormUrl,
  success: function(data){
    var 
      $form = $('#member_categories_form', data),
      $input = $('input[value="' + catID + '"]', $form),
      memberships = $form.find('input:checked').map(getValue).get(),
      $link,
      $placeholder = $(options.placeholder);
    
    // update the form's return value to the current page URL
    $('input[name="RET"]', $form).val(window.location.href);
    
    // check if the current wg id is in the list of memberships
    // and remove that, as the current wg will change
    // (this is where underscore/lodash are great: you don't need to check if the value is there before you try to remove it. previously I had to use $.inArray, then if the element was present do an array.splice() to modify the array )
    memberships = _.without(memberships, catID);
    
    $form
      .css({'display': 'none', 'visibility' : 'hidden' }) // make sure the form stays hidden when inevitably inserted into DOM
      .on('submit', function(){
        
        // validation
        // check that the list of *other* wgs has not changed
        
        var new_memberships = $form.find('input:checked').map(getValue).get(),
          valid;

        // find and remove the current wg id
        new_memberships = _.without(new_memberships, catID);

        valid = _.isEqual( memberships, new_memberships );
        
        if (! valid) { alert('hey sneaky! whatchu doin to my form?'); }
        
        return valid;

      });
    
    // build the action link and place it on my placeholder
    $link = $(document.createElement('a'))
      .addClass('btn ' + (isMember ? 'bad' : 'good') )
      .attr( {
        'href': '#',
        'id' : 'change_user_group_membership'
        })
      .html( (isMember ? 'Leave' : 'Join') + ' this User Group' )
      .appendTo($placeholder);
    
    $placeholder.on('click', function(e){
      e.preventDefault();
      
      // Set the current category checkbox to its current opposite
      $input.prop('checked', ! $input.prop('checked') );
      
      // Disable the button
      $link.addClass('disabled').prop('disabled',true).html('Submitting&hellip;');
      
      // Submit the form
      // (1) FF requires the form to be in the DOM to submit
      $form
        .appendTo('body') // (1)
        .submit();
        
      setTimeout(function(){
        OSLC.addMessage('Something went wrong! If it happens again, contact <a href="mailto:webmaster@open-services.net">the site admin</a>.', 'Ooops!',  'error');
        $link.removeClass('disabled').prop('disabled',false).html('Try again');
      }, 1000*25);

    });
    
  }
});


});