function ValidPhone() {
    var re = /^[0-9]{10}$/;
    var myPhone = document.getElementById('phone-number').value;
    var valid = re.test(myPhone);
    if (valid) output = ' ';
    else output = 'Неправильно вказаний телефон!';
    element = document.getElementById("message");
    // document.message.innerHTML = " ";
    // console.log(element);
    document.getElementById('message').innerHTML = document.getElementById('message').innerHTML+'<br />'+output;

    return valid;
}

// $('.button').on('click', function(){
//     $('.input').trigger('click');
// });
// $('.button1').on('click', function(){
//     $('.input1').trigger('click');
// });
// $('.button2').on('click', function(){
//     $('.input2').trigger('click');
// });
// $('.button3').on('click', function(){
//     $('.input3').trigger('click');
// });


function jmp(e){
    var max = ~~e.getAttribute('maxlength');
    if(max && e.value.length >= max){
        do{
            e = e.nextSibling;
        }
        while(e && !(/text/.test(e.type)));
        if(e && /text/.test(e.type)){
            e.focus();
        }
    }
}

function ValidName() {
    var re = /^[а-яА-ЯіїІЇa-zA-Z]+$/;
    var myName = document.getElementById('contact-data__name').value;
    var validName = re.test(myName);
    if (validName) output = ' ';
    else output = "Введіть ім'я!";
    document.getElementById('contact-data__form-error-name').innerHTML = document.getElementById('contact-data__form-error-name').innerHTML+'<br />'+output;

    return validName;
}

function ValidMiddleName() {
    var re = /^[а-яА-ЯіїІЇa-zA-Z]+$/;
    var myMiddleName = document.getElementById('contact-data__middle-name').value;
    var validMiddleName = re.test(myMiddleName);
    if (validMiddleName) output = ' ';
    else output = "Введіть по батькові!";
    document.getElementById('contact-data__form-error-mname').innerHTML = document.getElementById('contact-data__form-error-mname').innerHTML+'<br />'+output;

    return validMiddleName;
}

function ValidSname() {
    var re = /^[а-яА-ЯіїІЇa-zA-Z]+$/;
    var mySname = document.getElementById('contact-data__surname').value;
    var validSname = re.test(mySname);
    if (validSname) output = ' ';
    else output = "Введіть прізвище!";
    document.getElementById('contact-data__form-error-sname').innerHTML = document.getElementById('contact-data__form-error-sname').innerHTML+'<br />'+output;

    return validSname;
}
function ValidIdNumber() {
    var re = /^[0-9]{10}$/;
    var myIdnumber = document.getElementById('contact-data__id-number').value;
    var validIdnumber = re.test(myIdnumber);
    if (validIdnumber) output = ' ';
    else output = "Введіть ідентифікаційний номер!";
    document.getElementById('contact-data__form-error-id-number').innerHTML = document.getElementById('contact-data__form-error-id-number').innerHTML+'<br />'+output;

    return validIdnumber;
}


var contactFormElMain = $(".form-main");
var contactFormStatusElMain = contactFormElMain.find(".contacts-form__status-message");
var phoneInputElMain = contactFormElMain.find("[name = phone]");
var validatedFieldsMain = { phone: true };
var mandatoryFieldsMain = [ "phone"];

var aa =  document.getElementById("phone-number").value;


$(document).on('click','.form-main__btn',function() {
    var  valid = ValidPhone();
    if(valid == true){
      var phoneNumber = $("#phone-number").val();
        $(".form-main__submit-btn.form-main__btn").css("display", "none");
        $('.check-code').css("display", "block");

        $.ajax({
        type: "POST",
        url: "https://nr-sandbox.stage.digitalind.net/clients/isclient",
        headers: {
          'X-Auth-Token' : 'PTzQlEIYZVslkOyzKh41cJCfJCSuhJJ8'
        },
        data : {
          "phone" : '+38'+phoneNumber
        },

        success: function(msg){
            $("#answer-api-phone").attr("value", msg.client);
            $("#phone-client").attr("value", '+38'+phoneNumber);

            $.ajax({
                type: "POST",
                url: "https://nr-sandbox.stage.digitalind.net/generateOTP",
                headers: {
                    'X-Auth-Token' : 'PTzQlEIYZVslkOyzKh41cJCfJCSuhJJ8'
                },
                data : JSON.stringify({
                    "phone" : '+38'+phoneNumber,
                    "type" : "sms",
                    "appId" : "app",
                    "numeric" : true
                }),
                processData: false,
                contentType: "application/json",
                success: function(msg){

                    $("#answer-api-code").attr("value", msg.data.otp);
                },
                error: function(){
                    alert('error!');
                }

            });
        },
        error: function(){
          alert('error!');
        }
      })
    }
});

$(document).on('click','.check-code__button',function() {
    var code0 = document.getElementsByClassName("check-code__input")[0].value;
    var code1 = document.getElementsByClassName("check-code__input")[1].value;
    var code2 = document.getElementsByClassName("check-code__input")[2].value;
    var code3 = document.getElementsByClassName("check-code__input")[3].value;

    var code = code0 + code1 + code2 + code3;

    $("#people-code").attr("value", code);

    // перевірка на сервері чи є вільні оператори
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        // url: "https://nr-gateway.dev.ukrgasaws.com/9118aabf34299ead9f57921edb7c8209",
        url: "https://nr-gateway.ukrgasaws.com/9118aabf34299ead9f57921edb7c8209",
        headers: {
            "x-post-pathto": "/",
            // "x-post-geturl": "https://nr-clients.dev.ukrgasaws.com",
            "x-post-geturl": "https://nr-clients.ukrgasaws.com",
            "x-auth-token": "PTzQlEIYZVslkOyzKh41cJCfJCSuhJJ8",
            "x-post-method": "videoAuth/freeOperators"
        },
        processData: false,
        contentType: false,
        success: function (response) {
            $("#operator").attr("value", response.data.freeOperators);
        },
        error: function () {
            console.log('error operator');

        }
    });

    numberСheck();

});


function numberСheck() {

  var codeInput = +$("#people-code").val();
  var codeApi = +$("#answer-api-code").val();
  var phoneApi =  document.getElementById('answer-api-phone').value;
  var operator =  document.getElementById('operator').value;



    if(codeApi !== 0 ){
        // перевіряємо чи код з 4 цифр відповіний
        if(codeInput === codeApi){
            if(phoneApi === 'true'){
                // чи являється номер клієнта банку
                $('.thanks-client').css("display", "block");

            } else if(operator === 'false'){
                // перевірка чи є вільний оператор
                $('.thanks').css("display", "block");
            } else
            $('.verification').css("display", "block");
            $('.form-number').css("display", "none");
            $('.check-code').css("display", "none");

            $(document).on('click','.verification__no',function() {
                $('.verification').css("display", "none");
                $('.thanks').css("display", "block");

            });
            $(document).on('click','.verification__yes',function() {
                $('.verification').css("display", "none");
                $('.contact-data').css("display", "block");
            });

        }else
            $('.error-code').css("display", "block");

    }else {
        console.log(codeApi + ' error codeApi');

    }
return '';
}


$(document).on('click','.contact-data__button',function() {

    var  validN = ValidName();
    var  validSnane = ValidSname();
    var  validIdNumber = ValidIdNumber();
    var  validMiddleName = ValidMiddleName();
    if(validN == true && validSnane == true && validIdNumber == true && validMiddleName == true) {

        $('.contact-data').css("display", "none");
        // $('.contact-files-iin').css("display", "block");
        $('.block-first-questions').css("display", "block");
    }

});

$(document).on('click','.contact-files-iin__button',function() {

if(document.getElementById("file1").files[0] === undefined){
    // console.log(document.getElementById("file1").files[0]);
    // console.log('322222222222');
    $(".error-iin").css("display", "block")
}else {

    // console.log(document.getElementById("file1").files[0]);

    $('.contact-files-iin').css("display", "none");
    $('.contact-files').css("display", "block");
}

});

$(document).on('click','.contact-files__button',function() {


    if(document.getElementById("file2").files[0] === undefined){
        // console.log(document.getElementById("file1").files[0]);
        // console.log('322222222222');
        $(".error-file1").css("display", "block")
    }else if (document.getElementById("file3").files[0] === undefined) {
        $(".error-file1").css("display", "none");

        $(".error-file2").css("display", "block")

    }

    else {

    var idNumber = document.getElementById('contact-data__id-number').value;
    var surname = document.getElementById('contact-data__surname').value;
    var name = document.getElementById('contact-data__name').value;
    var email = document.getElementById('contact-data__email').value;
    var middleName = document.getElementById('contact-data__middle-name').value;
    var phone = document.getElementById('phone-client').value;



    var formData = new FormData();

    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('patronymic', middleName);
    formData.append('stateCode', idNumber);
    formData.append('phone', phone);
    formData.append('email', email);

    formData.append('stateCodePhoto', document.getElementById("file1").files[0]);
    formData.append('docPhoto1', document.getElementById("file2").files[0]);
    formData.append('docPhoto2', document.getElementById("file3").files[0]);
    formData.append('docPhoto3', document.getElementById("file4").files[0]);
    formData.append('docPhoto4', document.getElementById("file5").files[0]);
    formData.append('docPhoto5', document.getElementById("file6").files[0]);
    // formData.append('docPhoto4', document.getElementById("file5").files[0]);

    // відправляємо дані з формів
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        // url: "https://nr-gateway.dev.ukrgasaws.com/9118aabf34299ead9f57921edb7c8209",
        url: "https://nr-gateway.ukrgasaws.com/9118aabf34299ead9f57921edb7c8209",
        data: formData,
        headers: {
            "x-post-pathto": "/",
            "x-post-geturl": "https://nr-clients.ukrgasaws.com",
            // "x-post-geturl": "https://nr-clients.dev.ukrgasaws.com",
            "x-auth-token": "PTzQlEIYZVslkOyzKh41cJCfJCSuhJJ8",
            "x-post-method": "videoAuth"
        },
        processData: false,
        contentType: false,
        success: function (response) {
            // console.log(response.result);
            $("#iin").attr("value", response.result);

            iin();

        },
        error: function () {
        }
    });
    $(".contact-files__button").css("pointer-events", "none");
    $('.wait').css("display", "block");



    // setTimeout(iin, 5000);
    }
});


function iin() {
    var iin =  document.getElementById('iin').value;


    $('.contact-files').css("display", "none");


    if(iin === 'ok') {
        $('.finish-thanks').css("display", "block");


    } else if (iin === 'error') {

        $('.thanks-client').css("display", "block");


    } else
        $('.finish-thanks').css("display", "block");

}


// клас one-first-question
// модернизация  checkbox
document.forms.formFirstQuestion.onchange = function(e) {
    var target = e.target;
    if (target.name == "t8") {
        [].forEach.call(this.t8, function(el) {
            if (el != target && target.checked) {
                el.disabled = true;
                el.checked = false;
            } else if (el != target && !target.checked) {
                el.disabled = false;
                target.checked = false;
            }
        });
    }
};

// клас one-first-question
// модернизация  checkbox
document.forms.formSecondFirstQuestion.onchange = function(e) {
    var target = e.target;
    if (target.name == "t1") {
        [].forEach.call(this.t1, function(el) {
            if (el != target && target.checked) {
                el.disabled = true;
                el.checked = false;
            } else if (el != target && !target.checked) {
                el.disabled = false;
                target.checked = false;
            }
        });
    }
};

// Bывести блок, если выбран конкретный элемент выпадающего списка (Ні)
var adress = $('.register-adress.select-adress-block');
$('#registerAddress').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Ні') {
        adress.removeClass('select-adress-none');
    } else {
        adress.addClass('select-adress-none');
    }
});

// Bывести блок, если выбран конкретный элемент выпадающего списка (Так)
var maino = $('.maino.select-maino-block');
$('#you-own-movable-property').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Так') {
        maino.removeClass('select-maino-none');
    } else {
        maino.addClass('select-maino-none');
    }
});

// Bывести блок, у пенсіонера если выбран конкретный элемент выпадающего списка (Ні)
var pensionerAdress = $('.pensioner-register-adress.select-pensioner-adress-block');
$('#pensioner-adress').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Ні') {
        pensionerAdress.removeClass('select-pensioner-adress-none');
    } else {
        pensionerAdress.addClass('select-pensioner-adress-none');
    }
});
// Bывести блок, у пенсіонера если выбран конкретный элемент выпадающего списка (Так)
var pensionerMaino = $('.pensioner-maino.select-pensioner-maino-block');
$('#pensioner-own-movable-property').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Так') {
        pensionerMaino.removeClass('select-pensioner-maino-none');
    } else {
        pensionerMaino.addClass('select-pensioner-maino-none');
    }
});
// Bывести блок, у зайняті працівники (незалежна проф діяльність - адвокат, нотаріус, тощо) если выбран конкретный элемент выпадающего списка (Ні)
var selfEmployedWorkersAdress = $('.self-employed-workers-register-adress.select-self-employed-workers-adress-block');
$('#self-employed-workers-adress').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Ні') {
        selfEmployedWorkersAdress.removeClass('select-self-employed-workers-adress-none');
    } else {
        selfEmployedWorkersAdress.addClass('select-self-employed-workers-adress-none');
    }
});
// Bывести блок, у зайняті працівники (незалежна проф діяльність - адвокат, нотаріус, тощо) если выбран конкретный элемент выпадающего списка (Так)
var selfEmployedWorkersMaino = $('.self-employed-workers-maino.select-self-employed-workers-maino-block');
$('#self-employed-workers-property').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Так') {
        selfEmployedWorkersMaino.removeClass('select-self-employed-workers-maino-none');
    } else {
        selfEmployedWorkersMaino.addClass('select-self-employed-workers-maino-none');
    }
});

// Bывести блок, у Приватний підприємець если выбран конкретный элемент выпадающего списка (Ні)
var privateEntrepreneurAdress = $('.private-entrepreneur-adress.select-private-entrepreneur-adress-block');
$('#private-entrepreneur-adress').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Ні') {
        privateEntrepreneurAdress.removeClass('select-private-entrepreneur-adress-none');
    } else {
        privateEntrepreneurAdress.addClass('select-private-entrepreneur-adress-none');
    }
});

// Bывести блок, у Приватний підприємець если выбран конкретный элемент выпадающего списка (Так)
var privateEntrepreneurMaino = $('.private-entrepreneur-maino.select-private-entrepreneur-maino-block');
$('#private-entrepreneur-property').change(function() {
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 'Так') {
        privateEntrepreneurMaino.removeClass('select-private-entrepreneur-maino-none');
    } else {
        privateEntrepreneurMaino.addClass('select-private-entrepreneur-maino-none');
    }
});




$(document).on('click','.send-first-question',function() {
    // Ваш соціальний статус із наступних варіантів
    var selectedCheckBoxesStatus = document.querySelectorAll('.form-first-question input.check-radio:checked');
    var checkedValuesStatus = Array.from(selectedCheckBoxesStatus).map(cb => cb.value);
    // Mетa оформлення кредитної картки із наступних варіантів
    var selectedCheckBoxesMetaCreditCard = document.querySelectorAll('.second-first-question input.check-radio:checked');
    var checkedValuesMetaCreditCard = Array.from(selectedCheckBoxesMetaCreditCard).map(cb => cb.value);

    if (checkedValuesStatus == 'Найманий працівник') {
        $('.block-first-questions').css("display", "none");
        $('.employees-questions').css("display", "block");

        $(document).on('click', '.send-employees-question', function () {
            // отримаемо місце роботи яке ввів користувач
            var employeesWork = document.getElementById('employeesWork').value;
            // document.getElementById('str').innerHTML="Вы ввели: "+val;

            // отримаемо сімейний стан
            var selectEmployeesStatus = document.getElementById("employeesStatus");
            var valueEmployeesStatus = selectEmployeesStatus.value;

            // чи співпадає з адресою фактичного проживаннян
            var selectEmployeesAddress = document.getElementById("registerAddress");
            var valueEmployeesAddress = selectEmployeesAddress.value;

            // фактичнa адресa місця проживання
            var employeesActualAddress = document.getElementById('employeesActualAddress').value;

            //  середньомісячний дохід
            var selectMonthlyInCome = document.getElementById("monthlyIncome");
            var valueMonthlyInCome = selectMonthlyInCome.value;

            //  очікуваний надходження коштів
            var selectExpectedRevenue = document.getElementById("expectedRevenue");
            var valueExpectedRevenue = selectExpectedRevenue.value;

            //  Чи володієте Ви будь-яким рухомим/нерухомим майном
            var selectYouOwnMovableProperty = document.getElementById("you-own-movable-property");
            var valueYouOwnMovableProperty = selectYouOwnMovableProperty.value;

            //  Якою саме власністю з переліченого ви володієте?
            var selectListedProperty = document.getElementById("listedProperty");
            var valueListedProperty = selectListedProperty.value;

            //  Чи маєте Ви відкриті рахунки з перелічених в інших банках?:
            var selectOpenAccounts = document.getElementById("openAccounts");
            var valueOpenAccounts = selectOpenAccounts.value;


            // перевірка чи всі головні поля не пусті
            if(
                !!employeesWork
                || !!valueEmployeesStatus
                || !!valueEmployeesAddress
                || !!valueMonthlyInCome
                || !!valueExpectedRevenue
                || !!valueYouOwnMovableProperty
                || !!valueOpenAccounts
            ){
                // перевірка чи додаткові поля заповненні
                if(
                    (valueEmployeesAddress == 'Так' || valueEmployeesAddress == 'Ні' && !!employeesActualAddress)
                    &&
                    (valueYouOwnMovableProperty == 'Ні' || valueYouOwnMovableProperty == 'Так' && valueListedProperty !== 'неактив')
                )
                {
                    $(".employees-questions").css("display", "none");

                    $('.contact-files-iin').css("display", "block");


                }else {

                    $(".err-mes").removeClass("err-mes-open");
                    $(".err-mes").addClass("err-mes-open");

                }
            }
            else{

                $(".err-mes").removeClass("err-mes-open");
                $(".err-mes").addClass("err-mes-open");

            }
        })

    }
    else  if (checkedValuesStatus == 'Пенсіонер') {
        $('.block-first-questions').css("display", "none");
        $('.pensioners-questions').css("display", "block");

        $(document).on('click', '.pensioners-question', function () {

            // отримаемо сімейний стан
            var selectPensionerStatus = document.getElementById("pensionerStatus");
            var valuePensionerStatus = selectPensionerStatus.value;

            // чи співпадає з адресою фактичного проживаннян
            var selectPensionerAddress = document.getElementById("pensioner-adress");
            var valuePensionerAddress = selectPensionerAddress.value;
            // var valueEmployeesAddress = JSON.stringify(valueEmployeesAddress);

            // фактичнa адресa місця проживання
            var pensionerActualAddress = document.getElementById('pensionerActualAddress').value;

            //  середньомісячний дохід0
            var selectPensionerMonthlyIncome = document.getElementById("pensionerMonthlyIncome");
            var valuePensionerMonthlyInCome = selectPensionerMonthlyIncome.value;

            //  очікуваний надходження коштів
            var selectPensionerExpectedRevenue = document.getElementById("pensionerExpectedRevenue");
            var valuePensionerExpectedRevenue = selectPensionerExpectedRevenue.value;

            //  Чи володієте Ви будь-яким рухомим/нерухомим майном
            var selectPensionerYouOwnMovableProperty = document.getElementById("pensioner-own-movable-property");
            var valuePensionerYouOwnMovableProperty = selectPensionerYouOwnMovableProperty.value;
            // var valueYouOwnMovableProperty = JSON.stringify(valueYouOwnMovableProperty);

            //  Якою саме власністю з переліченого ви володієте?
            var selectPensionerListedProperty = document.getElementById("pensionerListedProperty");
            var valuePensionerListedProperty = selectPensionerListedProperty.value;

            //  Чи маєте Ви відкриті рахунки з перелічених в інших банках?:
            var selectPensionerOpenAccounts = document.getElementById("pensionerOpenAccounts");
            var valuePensionerOpenAccounts = selectPensionerOpenAccounts.value;


            // перевірка чи всі головні поля не пусті
            if(
                !!valuePensionerStatus
                || !!valuePensionerAddress
                || !!valuePensionerMonthlyInCome
                || !!valuePensionerExpectedRevenue
                || !!valuePensionerYouOwnMovableProperty
                || !!valuePensionerOpenAccounts
            ){
                // перевірка чи додаткові поля заповненні
                // if(
                //     valuePensionerAddress === 'Так'
                //     || valuePensionerAddress === 'Ні' && !!pensionerActualAddress
                //     || valuePensionerYouOwnMovableProperty === 'Ні'
                //     || valuePensionerYouOwnMovableProperty === 'Так' && !!valuePensionerListedProperty
                //
                // )
                if(
                    (valuePensionerAddress == 'Так' || valuePensionerAddress == 'Ні' && !!pensionerActualAddress)
                    &&
                    (valuePensionerYouOwnMovableProperty == 'Ні' || valuePensionerYouOwnMovableProperty == 'Так' && valuePensionerListedProperty !== 'неактив')
                )

                {
                    $(".pensioners-questions").css("display","none");

                    $('.contact-files-iin').css("display", "block");


                }else {

                    $(".err-mes").removeClass("err-mes-open");
                    $(".err-mes").addClass("err-mes-open");

                }
            }
            else{

                $(".err-mes").removeClass("err-mes-open");
                $(".err-mes").addClass("err-mes-open");

            }
        })

    }
    else  if (checkedValuesStatus == 'Самостійно зайнятий працівник (незалежна проф.діяльність)') {
        $('.block-first-questions').css("display", "none");
        $('.self-employed-workers-questions').css("display", "block");

        $(document).on('click', '.self-employed-workers-question', function () {

            // Зазначте рід вашої незалежної професійної діяльності
            var selectEmployedWorkersProfession = document.getElementById("selfEmployedWorkersProfession");
            var valueEmployedWorkersProfession = selectEmployedWorkersProfession.value;

            // Зазначте код податкової
            var selfEmployedWorkersTaxCode = document.getElementById('selfEmployedWorkersTaxCode').value;

            // Зазначте дату з якої Ви проводите професійну діяльність
            var dateStartedProfesion = document.getElementById('selfEmployedWorkersDateStartedProfesion').value;

            // отримаемо сімейний стан
            var selectSelfEmployedWorkersStatus = document.getElementById("selfEmployedWorkersStatus");
            var valueSelfEmployedWorkersStatus = selectSelfEmployedWorkersStatus.value;

            // чи співпадає з адресою фактичного проживаннян
            var selectSelfEmployedWorkersAdress = document.getElementById("self-employed-workers-adress");
            var valueSelfEmployedWorkersAdress = selectSelfEmployedWorkersAdress.value;
            // var valueEmployeesAddress = JSON.stringify(valueEmployeesAddress);

            // фактичнa адресa місця проживання
            var selfEmployedWorkersActualAddress = document.getElementById('selfEmployedWorkersActualAddress').value;

            //  середньомісячний дохід
            var selectSelfEmployedWorkersMonthlyIncome = document.getElementById("selfEmployedWorkersMonthlyIncome");
            var valueSelfEmployedWorkersMonthlyIncome = selectSelfEmployedWorkersMonthlyIncome.value;

            //  очікуваний надходження коштів
            var selectSelfEmployedWorkersExpectedRevenue = document.getElementById("selfEmployedWorkersExpectedRevenue");
            var valueSelfEmployedWorkersExpectedRevenue = selectSelfEmployedWorkersExpectedRevenue.value;

            //  Чи володієте Ви будь-яким рухомим/нерухомим майном
            var selectSelfEmployedWorkersProperty = document.getElementById("self-employed-workers-property");
            var valueSelfEmployedWorkersProperty = selectSelfEmployedWorkersProperty.value;
            // var valueYouOwnMovableProperty = JSON.stringify(valueYouOwnMovableProperty);

            //  Якою саме власністю з переліченого ви володієте?
            var selectSelfEmployedWorkersListedProperty = document.getElementById("selfEmployedWorkersListedProperty");
            var valueSelfEmployedWorkersListedProperty = selectSelfEmployedWorkersListedProperty.value;

            //  Чи маєте Ви відкриті рахунки з перелічених в інших банках?:
            var selectSelfEmployedWorkersOpenAccounts = document.getElementById("selfEmployedWorkersOpenAccounts");
            var valueSelfEmployedWorkersOpenAccounts = selectSelfEmployedWorkersOpenAccounts.value;

            // перевірка чи всі головні поля не пусті
            if(
                !!valueEmployedWorkersProfession
                || !!selfEmployedWorkersTaxCode
                || !!dateStartedProfesion
                || !!valueSelfEmployedWorkersStatus
                || !!valueSelfEmployedWorkersAdress
                || !!valueSelfEmployedWorkersMonthlyIncome
                || !!valueSelfEmployedWorkersExpectedRevenue
                || !!valueSelfEmployedWorkersProperty
                || !!valueSelfEmployedWorkersOpenAccounts
            ){
                // перевірка чи додаткові поля заповненні
                // if(
                //     valuePensionerAddress === 'Так'
                //     || valuePensionerAddress === 'Ні' && !!pensionerActualAddress
                //     || valuePensionerYouOwnMovableProperty === 'Ні'
                //     || valuePensionerYouOwnMovableProperty === 'Так' && !!valuePensionerListedProperty
                //
                // )
                if(
                    (valueSelfEmployedWorkersAdress == 'Так' || valueSelfEmployedWorkersAdress == 'Ні' && !!selfEmployedWorkersActualAddress)
                    &&
                    (valueSelfEmployedWorkersProperty == 'Ні' || valueSelfEmployedWorkersProperty == 'Так' && valueSelfEmployedWorkersListedProperty !== 'неактив')
                )

                {
                    $(".self-employed-workers-questions").css("display","none");
                    $('.contact-files-iin').css("display", "block");

                }else {

                    $(".err-mes").removeClass("err-mes-open");
                    $(".err-mes").addClass("err-mes-open");

                }
            }
            else{

                $(".err-mes").removeClass("err-mes-open");
                $(".err-mes").addClass("err-mes-open");

            }
        })

    }
    else  if (checkedValuesStatus == 'Приватний підприємець') {
        $('.block-first-questions').css("display", "none");
        $('.private-entrepreneur-questions').css("display", "block");

        $(document).on('click', '.private-entrepreneur-question', function () {

            // Зазначте код податкової
            var privateEntrepreneurTaxCode = document.getElementById('privateEntrepreneurTaxCode').value;

            // Зазначте дату з якої Ви проводите професійну діяльність
            var privateEntrepreneurDateStartedProfesion = document.getElementById('privateEntrepreneurDateStartedProfesion').value;

            // отримаемо сімейний стан
            var selectPrivateEntrepreneurStatus = document.getElementById("privateEntrepreneurStatus");
            var valuePrivateEntrepreneurStatus = selectPrivateEntrepreneurStatus.value;

            // чи співпадає з адресою фактичного проживаннян
            var selectPrivateEntrepreneurAdress = document.getElementById("private-entrepreneur-adress");
            var valuePrivateEntrepreneurAdress = selectPrivateEntrepreneurAdress.value;
            // var valueEmployeesAddress = JSON.stringify(valueEmployeesAddress);

            // фактичнa адресa місця проживання
            var privateEntrepreneurActualAddress = document.getElementById('privateEntrepreneurActualAddress').value;

            //  середньомісячний дохід
            var selectPrivateEntrepreneurMonthlyIncome = document.getElementById("privateEntrepreneurMonthlyIncome");
            var valueSelectPrivateEntrepreneurMonthlyIncome = selectPrivateEntrepreneurMonthlyIncome.value;

            //  очікуваний надходження коштів
            var selectPrivateEntrepreneurExpectedRevenue = document.getElementById("privateEntrepreneurExpectedRevenue");
            var valuePrivateEntrepreneurExpectedRevenue = selectPrivateEntrepreneurExpectedRevenue.value;

            //  Чи володієте Ви будь-яким рухомим/нерухомим майном
            var selectPrivateEntrepreneurProperty = document.getElementById("private-entrepreneur-property");
            var valuePrivateEntrepreneurProperty = selectPrivateEntrepreneurProperty.value;
            // var valueYouOwnMovableProperty = JSON.stringify(valueYouOwnMovableProperty);

            //  Якою саме власністю з переліченого ви володієте?
            var selectPrivateEntrepreneurListedProperty = document.getElementById("privateEntrepreneurListedProperty");
            var valuePrivateEntrepreneurListedProperty = selectPrivateEntrepreneurListedProperty.value;

            //  Чи маєте Ви відкриті рахунки з перелічених в інших банках?:
            var selectPrivateEntrepreneurOpenAccounts = document.getElementById("privateEntrepreneurOpenAccounts");
            var valuePrivateEntrepreneurOpenAccounts = selectPrivateEntrepreneurOpenAccounts.value;

            // перевірка чи всі головні поля не пусті
            if(
                // !!valueEmployedWorkersProfession
                // ||
                !!privateEntrepreneurTaxCode
                || !!privateEntrepreneurDateStartedProfesion
                || !!valuePrivateEntrepreneurStatus
                || !!valuePrivateEntrepreneurAdress
                || !!valueSelectPrivateEntrepreneurMonthlyIncome
                || !!valuePrivateEntrepreneurExpectedRevenue
                || !!valuePrivateEntrepreneurProperty
                || !!valuePrivateEntrepreneurOpenAccounts
            ){
                // перевірка чи додаткові поля заповненні
                // if(
                //     valuePensionerAddress === 'Так'
                //     || valuePensionerAddress === 'Ні' && !!pensionerActualAddress
                //     || valuePensionerYouOwnMovableProperty === 'Ні'
                //     || valuePensionerYouOwnMovableProperty === 'Так' && !!valuePensionerListedProperty
                //
                // )
                if(
                    (valuePrivateEntrepreneurAdress == 'Так' || valuePrivateEntrepreneurAdress == 'Ні' && !!privateEntrepreneurActualAddress)
                    &&
                    (valuePrivateEntrepreneurProperty == 'Ні' || valuePrivateEntrepreneurProperty == 'Так' && valuePrivateEntrepreneurListedProperty !== 'неактив')
                )

                {
                    $(".private-entrepreneur-questions").css("display","none");
                    $('.contact-files-iin').css("display", "block");

                }else {

                    $(".err-mes").removeClass("err-mes-open");
                    $(".err-mes").addClass("err-mes-open");

                }
            }
            else{

                $(".err-mes").removeClass("err-mes-open");
                $(".err-mes").addClass("err-mes-open");

            }
        })

    }
    else  if (checkedValuesStatus == 'Безробітний') {
        $('.block-first-questions').css("display", "none");
        $('.unemployed-questions').css("display", "block");

        $(document).on('click', '.unemployed-question', function () {

            $(".unemployed-questions").css("display","none")

        })

    }

    else  {

        console.log(checkedValuesStatus);
    }


});


$(document).on('click','.confirm-button',function () {

    if(
        ($('.cheched1').prop('checked'))
        &&
        ($('.cheched2').prop('checked'))
        &&
        ($('.cheched3').prop('checked'))

    ){
        $(".confirm").css("display", "none")

    }else {
        $(".confirm .err-mes").removeClass("err-mes-open");
        $(".confirm .err-mes").addClass("err-mes-open");
    }

})



// document.getElementById('file1').addEventListener('change', function(){
//     if( this.value ){
//         output = 'файл є';
//         document.getElementById('file1Message').innerHTML = document.getElementById('file1Message').innerHTML+'<br />'+output;
//
//         console.log( "Оппа, выбрали файл!" );
//         console.log( this.value );
//     } else { // Если после выбранного тыкнули еще раз, но дальше cancel
//         console.log( "Файл не выбран" );
//     }
// });
