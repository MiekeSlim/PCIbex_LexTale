## R script to calculate the results per participant on the LexTALE test, implemented on Ibex using PennController
# Author: Mieke Slim

## Required packages 
if (!require(dplyr)) {install.packages("dplyr"); require(dplyr)}
if (!require(reshape2)) {install.packages("reshape2"); require(reshape2)}

## Read in the results from PCIbec, this function was written by Zehr & Schwarz (2018) (see https://www.pcibex.net/wiki/r-script/ )
read.pcibex <- function(filepath, auto.colnames=TRUE, fun.col=function(col,cols){cols[cols==col]<-paste(col,"Ibex",sep=".");return(cols)}) {
  n.cols <- max(count.fields(filepath,sep=",",quote=NULL),na.rm=TRUE)
  if (auto.colnames){
    cols <- c()
    con <- file(filepath, "r")
    while ( TRUE ) {
      line <- readLines(con, n = 1, warn=FALSE)
      if ( length(line) == 0) {
        break
      }
      m <- regmatches(line,regexec("^# (\\d+)\\. (.+)\\.$",line))[[1]]
      if (length(m) == 3) {
        index <- as.numeric(m[2])
        value <- m[3]
        if (index < length(cols)){
          cols <- c()
        }
        if (is.function(fun.col)){
          cols <- fun.col(value,cols)
        }
        cols[index] <- value
        if (index == n.cols){
          break
        }
      }
    }
    close(con)
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=cols))
  }
  else{
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=seq(1:n.cols)))
  }
}

## Prepare raw results file
results <- subset(read.pcibex("results.csv"), PennElementType == 'Selector')  # Here, it is assumed that you saved the results file as a csv file with the name 'results' in the R working directory, moreover we're only interested in the responses on the Selector element in the trials
results = select(results, Item.number, Element.number, Block, Subject, Stimulus, Type, Block, Value) # I have selected the only columns I am interested in for the analyses, in order to get a better overview of the data, feel free to adjust to your liking 
## Deduce the accuracy per trial per participant:
for(i in 1:nrow(results)){
  if ((results$Type[i] == "word") && (results$Value[i] == "yes")) {
    results$Accuracy[i] = 1
  }
  else if ((results$Type[i] == "nonword") && (results$Value[i] == "no")) {
    results$Accuracy[i] = 1
  }
  else {
    results$Accuracy[i] = 0
  }
}
## split the dummy trials from the 'real' trials in the raw results file:
dummies = subset(results, Block == 'dummy')
results = subset(results, Block == 'trial')

## Calculate the scores per participant
# First, calculate the sum of selected words and nonwords per participant:
scores = dcast(aggregate(Accuracy ~ Subject + Type, FUN = sum, data = results), formula = Subject ~ Type, value.var = "Accuracy")
## And then, calculate the final score with the following formula: ((number of words correct/40*100) + (number of nonwords correct/20*100)) / 2
scores$score = ((scores$word/40*100) + (scores$nonword/20*100)) / 2 
View(scores)
