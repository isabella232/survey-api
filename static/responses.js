//
var BASE_URL = 'http://' + window.location.host;

// Main ViewModel for the page
var PageVM = function(pageName) {
  var self = SurveyPageVM(pageName);

  // Delete confirmation VM
  self.deleteModal = new DeleteModalVM();

  // The list of responses
  self.responses = ko.observableArray([]);

  self.responses_url = ko.computed(function() {
    return BASE_URL + '/surveys/' + self.survey_id() + '/responses'
  });

  self.refreshData = function() {
    console.log('Getting data');
    $.ajax(self.responses_url(), { dataType: 'json' })
    .done(function(data) {
      if (data.responses) {
        self.responses(data.responses);
      }
    });
  };

  // Confirm that we should remove a response
  self.confirmRemoveResponse = function(item) {
    // Remove a response entry from the database
    function remover() {
      var url = BASE_URL + '/surveys/' + self.survey_id() + '/responses/' + item.id;
      deleteFromAPI(url, function() {
        // If successful, remove the deleted item from the observable list
        self.responses.remove(item);
      });
    }
    self.deleteModal.activate(remover);
  };

  self.onSetSurvey = refreshData;
  if (self.survey_id() != '') {
    refreshData();
  }

  return self;
}

$(document).ready(function() {
  $('body').css('visibility', 'visible');
  ko.applyBindings(PageVM('responses'));
});

