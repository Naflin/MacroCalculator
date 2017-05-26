function displayData() {
    var measurement = $('input[name="measurement"]:checked').val();
    var isMetric = (measurement == 'true');
    var gender = $('input[name="gender"]:checked').val();
    var age = parseInt($('input[name="age"]').val());
    var metricWeight = parseInt($('input[name="metricWeight"]').val());
    var imperialWeight = parseInt($('input[name="imperialWeight"]').val());
    var feet = parseInt($('input[name="feet"]').val());
    var inches = parseInt($('input[name="inches"]').val());
    var cm = parseInt($('input[name="cm"]').val());
    //var formula = $('input[name="formula"]:checked').val();
    //var isMifflin = (formula == 'lean');
    var goalChoice = $('input[name="goal"]:checked').val();
    var goal;
    var activitylevel = parseInt($('#activitylevel').val());
    
    var ser = $('#macroForm').serialize();
        
    if(isMetric) {
        feet = 5;
        inches = 8;
    } else {
        cm = 0;
    }
    
    if(feet == "" || !feet) {
        feet = 0;
    }
    if(inches == "" || !inches) {
        inches = 0;
    }
    if(cm == "" || !cm) {
        cm = 0;
    }
        
    if(goalChoice == "lose") {
        goal = 0.85;
    } else if(goalChoice == "maintain") {
        goal = 1.00;
    } else {
        goal = 1.1;
    }
    
    var data = 
    {
      'gender': gender,           // Required if using Mifflin-St Jeor
      'age': age,                  // Required if using Mifflin-St Jeor
      'isMetric': isMetric,          // Provide metric inputs? (cm, kg)
      'ft': feet,                    // Required if using Mifflin-St Jeor and isMetric == false
      'in': inches,                   // Required if using Mifflin-St Jeor and isMetric == false
      'cm': cm,                 // Required if using Mifflin-St Jeor and isMetric == true
      'lbs': imperialWeight,                 // Required if isMetric == false
      'kg': metricWeight,                 // Required if isMetric == true
      'mifflinStJeor': true,      // True for lean individuals, false for overweight
      'bodyFatPercentage': null,  // Required if not using Mifflin-St Jeor
      'exerciseLevel': activitylevel,         // See exerciseLevelActivityMultiplier()
      'goal': goal,               // TDEE Modifier. Recommended: Maintain(1.0), Cut(0.85 or 0.8), Bulk(1.05 or 1.1)
      'protein': 0.9,             // Protein grams per lb of body weight. Recommend: 0.7, 0.8, or 0.9
      'fat': 0.35                 // Fat grams per lb of body weight. Recommend: 0.3, 0.35, or 0.4
    };

    var calc = iifym.calculate(data);
    
    console.log(calc);
    
    //$('#tempbreak').text("Breakdown: " + measurement + " " + gender + " " + age + " " + " " + weight + " " + feet + " " + inches + " " + cm);
    
    $('#calsperday').text(calc.tdee + " Calories Per Day");
    $('#carbs').text(calc.carbs + " grams");
    $('#protein').text(calc.protein + " grams");
    $('#fat').text(calc.fat + " grams");
}

$(document).ready(function() {
   $('input[name="measurement"]').click(function() {
       if ($(this).attr("value") == "false") {
            $(".metric").hide('slow');
            $(".imperial").show('slow')
        }
        if ($(this).attr("value") == "true") {
            $(".metric").show('slow');
            $(".imperial").hide('slow');
        }
            
   });
});

$( "#macroForm" ).validate({
  rules: {
    age: {
      required: true,
      range: [10, 80]
    },
    imperialWeight: {
        required: "#imperial:checked",
        range: [1, 1000]
    },
    metricWeight: {
        required: "#metric:checked",
        range: [1, 1000]
    },
    cm: {
        required: "#metric:checked",
        range: [0,1000]
    },
    inches: {
        required: "#imperial:checked",
        range: [0,1000]
    },
    feet: {
        required: "#imperial:checked",
        range: [0,1000]
    }
  },
  submitHandler: function(form) {
      displayData();
  }
});


//document.querySelector("#macroForm").addEventListener("submit", function(e){
//  e.preventDefault();
//  var elem = document.getElementById("data");
//  var measurement = document.querySelector('input[name="measurement"]:checked').value;
//  var age = document.querySelector('input[name="age"]').value;
//  console.log(measurement + " " + age);
//  
//  elem.innerHTML += measurement + " " + age;
//});
//$( "#macroForm" ).submit(function( event ) {