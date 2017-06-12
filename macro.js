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
    var goalChoice = $('input[name="goal"]:checked').val();
    var goal;
    var activitylevel = parseInt($('#activitylevel').val());
    var bodyType = $('input[name="formula"]:checked').val();
    var isMifflin = (bodyType == 'true');
    var waist = parseInt($('input[name="waist"]').val());
    var wrist = parseInt($('input[name="wrist"]').val());
    var hip = parseInt($('input[name="hip"]').val());
    var forearm = parseInt($('input[name="forearm"]').val());
    var bodyFatPercentage;
    var weight;
    
    //var ser = $('#macroForm').serialize();
    
//    $('#maintitle').text("waist: " + waist + ", wrist: " + wrist + "hip: " + hip + "forearm: " + forearm);
    
    if(isMetric) {
        feet = 5;
        inches = 8;
        weight = metricWeight * 2.20462;
    } else {
        cm = 0;
        weight = imperialWeight;
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
    
    if(gender == "male") {
        bodyFatPercentage = getBFPMale(weight, waist);
    } else if(gender == "female") {
        bodyFatPercentage = getBFPFemale(weight, wrist, waist, hip, forearm);
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
      'mifflinStJeor': isMifflin,      // True for lean individuals, false for overweight
      'bodyFatPercentage': bodyFatPercentage,  // Required if not using Mifflin-St Jeor
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
    $('#bodyfatpercentage').text(bodyFatPercentage);
}

//Calculate body fat percentage for female
var getBFPFemale = function(weight, wrist, waist, hip, forearm) {
    var f1 = (weight * 0.732) + 8.987;
    var f2 = wrist / 3.140;
    var f3 = waist * 0.157;
    var f4 = hip * 0.249;
    var f5 = forearm * 0.434;
    var leanBodyMass = f1 + f2 - f3 - f4 + f5;
    var bodyFatWeight = weight - leanBodyMass;
    var bodyFatPercentage = (bodyFatWeight) / weight;
    return bodyFatPercentage;
}

//Calculate body fat percentage for male
var getBFPMale = function(weight, waist) {
    var f1 = (weight * 1.082) + 94.42;
    var f2 = waist * 4.15;
    var leanBodyMass = f1 - f2;
    var bodyFatWeight = weight - leanBodyMass;
    var bodyFatPercentage = (bodyFatWeight) / weight;
    return bodyFatPercentage;
}

$(document).ready(function() {
    $('input[name="measurement"]').click(function() {
       if ($(this).attr("value") == "false") {
            $(".metric").hide('slow');
            $(".imperial").show('slow');
        }
        if ($(this).attr("value") == "true") {
            $(".metric").show('slow');
            $(".imperial").hide('slow');
        }
    });
    
    $('input[name="gender"]').click(function() {
       if($(this).attr("value") == "male") {
            $('.female').hide('slow');
        } else {
            $('.female').show('slow');
        } 
    });
    
    $('input[name="formula"]').click(function() {
        if ($(this).attr("value") == "true") {
            $('.formula-measurements').hide('slow');
        }
        if ($(this).attr("value") == "false") {
            $('.formula-measurements').show('slow');
        }
    });
});

$( "#form-macro" ).validate({
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
        range: [0,11]
    },
    feet: {
        required: "#imperial:checked",
        range: [0,8]
    },
    waist: {
        required: "#overweight:checked",
        range: [0, 100]
    },
    wrist: {
        required: "#overweight:checked",
        range: [0, 100]
    },
    hip: {
        required: "#overweight:checked",
        range: [0, 100]
    },
    forearm: {
        required: "#overweight:checked",
        range: [0, 100]
    }
  },
  submitHandler: function(form) {
      displayData();
  }
});


//$( "#macroForm" ).submit(function( event ) { 
//    
//
//    var female = getBFPFemale(150, 8, 30, 36, 12);
//    var male = getBFPMale(150, 30);
//    
//    $('#maintitle').text("female: " + female + ", male: " + male);
//});

//document.querySelector("#macroForm").addEventListener("submit", function(e){
//  e.preventDefault();
//  var elem = document.getElementById("data");
//  var measurement = document.querySelector('input[name="measurement"]:checked').value;
//  var age = document.querySelector('input[name="age"]').value;
//  console.log(measurement + " " + age);
//  
//  elem.innerHTML += measurement + " " + age;
//});