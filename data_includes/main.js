//// Script to implement the English version of the LexTALE test (Lemhöfer & Broersma, 2012) in Ibex using PennController ////
/// Author: Mieke Slim

PennController.ResetPrefix(null);
//// Use this command before publishing:
// PennController.DebugOff() 
PennController.Sequence("LexTale_instructions", "LexTale_trials", "closing")

//// Implement the LexTale test
/// Instructions:

// Subject info
   PennController("LexTale_instructions",
    defaultText
    ,
    newText("LexTale_InstructionText", "Welcome! <br><br> This test consists of about 60 trials, in each of which you will see a string of letters. Your task is to decide whether this is an existing English word or not. <br><br>If you think it is an existing English word, you click on <strong>yes</strong>, and if you think it is not an existing English word, you click on <strong>no</strong>. If you are sure that the word exists, even though you don’t know its exact meaning, you may still respond <strong>yes</strong>. But if you are not sure if it is an existing word, you should respond <strong>no</strong>. <br><br> In this test, we use British English rather than American English spelling. For example: <i>realise</i> instead of <i>realize</i>; <i>colour</i> instead of <i>color</i>, and so on. Please don’t let this confuse you. This test is not about detecting such subtle spelling differences anyway <br><br> You have as much time as you like for each decision. This test will take about 5 minutes.") 
    ,
    newCanvas("myCanvas", 600, 600)
            .settings.add(0,0, getText("LexTale_InstructionText"))
            .print()
    ,              
    newTextInput("Subject", randomnumber = Math.floor(Math.random()*1000000))             
    ,
    newButton("Start")
        .print()
        .wait()
    ,
    newVar("Subject")
        .settings.global()
        .set( getTextInput("Subject") )
    )
    .log( "Subject" , getVar("Subject") )
   

/// Trials
    PennController.Template(
        PennController.GetTable( "stimuli.csv")
        ,
        trial => PennController("LexTale_trials",
            newText("stimulus", trial.Stimulus)
                .settings.css("font-size", "60px")
                .settings.css("font-family", "avenir")
                .settings.bold()
                .settings.center()
                .print()
              ,
            newText("no", "No")
                .settings.css("font-size", "60px")
                .settings.css("font-family", "avenir")
                .settings.color("red")
                .settings.bold()
            ,
            newText("yes", "Yes")
                .settings.css("font-size", "60px")
                .settings.css("font-family", "avenir")
                .settings.color("green")
                .settings.bold()

            ,
            newCanvas(800, 600)
                .settings.add( 0,     100,      getText("no"))
                .settings.add( 500,     100,    getText("yes"))
                .print()
            ,
            newSelector()
                .settings.add(getText("no") , getText("yes") )
                .settings.log()
                .wait()
        )
    .log( "Stimulus"    , trial.Stimulus    )
    .log( "Type"        , trial.Type        )
    .log( "Block"       , trial.Block       )
    .log( "Subject"         , getVar("Subject")         ) 
    )
 
// Send results to server
//PennController.SendResults();

/// Closing text
    PennController("closing",
        defaultText
            .print()
        ,
        newText("<p>Thank you for participating!</p>")
    )
    
