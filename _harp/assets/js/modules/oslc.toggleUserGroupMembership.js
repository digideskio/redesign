$(document).ready(function(){

// set in the EE template
var options = window.toggleMembershipOptions;

if (! options) {return;}

// sugar
var
  cat_id = options.workgroupCategory,
  is_member = options.isWorkgroupMember;


$.ajax({
  url: options.changeMembershipFormUrl,
  success: function(data){
    var 
      $form = $('#member_categories_form', data),
      $input = $('input[value="' + cat_id + '"]', $form),
      memberships = [],
      current_cat_idx,
      $link,
      $placeholder = $(options.placeholder);
    
    // update the form's return value to the current page URL
    $('input[name="RET"]', $form).val(window.location.href);
    
    // find all existing memberships
    $form.find('input:checked').each(function(){
      memberships.push( $(this).val() );
    });
    
    // check if the current wg is part of them
    current_cat_idx = $.inArray( cat_id, memberships);
    
    // if so, remove that, as the current wg will change
    (current_cat_idx > 0) && memberships.splice( current_cat_idx, 1 );
    
    $form
      .css({'display': 'none', 'visibility' : 'hidden' }) // make sure the form stays hidden when inevitably inserted into DOM
      .on('submit', function(){
        
        // validation
        // check that the list of *other* wgs has not changed
        
        var new_memberships = [],
          current_cat_idx,
          valid;
        
        $form.find('input:checked').each(function(){
          new_memberships.push( $(this).val() );
        });
        
        // find and remove the current wg id
        current_cat_idx = $.inArray( cat_id, new_memberships );
        (current_cat_idx > 0) && new_memberships.splice( current_cat_idx, 1 );
        
        // clever: http://stackoverflow.com/questions/1773069/using-jquery-to-compare-two-arrays
        valid = $( memberships ).not( new_memberships ).length === 0 && $( new_memberships ).not( memberships ).length === 0;
        
        ! valid && alert('hey sneaky! whatchu doin to my form?');
        
        return valid;

      });
    
    // build the action link and place it on my placeholder
    $link = $(document.createElement('a'))
      .addClass('btn ' + (is_member ? 'bad' : 'good') )
      .attr( {
        'href': '#',
        'id' : 'change_user_group_membership'
        })
      .html( (is_member ? 'Leave' : 'Join') + ' this User Group' )
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