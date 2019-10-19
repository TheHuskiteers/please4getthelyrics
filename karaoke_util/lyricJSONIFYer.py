import midifile as mf 
import os
import sys
import json
'''
Reads .kar files in the input directory. Creates an output directory and outputs just the lyric track. 
'''

class TimeStampEvent:
  def __init__(self,timestamp,syllable):
    self.timestamp = timestamp
    self.lyric = syllable
  def shiftTime(self,amount):
    self.timestamp += amount
  def normalizeBPM(self, oldBPM, newBPM):
    self.timestamp = self.timestamp * float(newBPM) / float(oldBPM)
  def __repr__(self):
    return "[{1:.2f} '{0}']".format(self.lyric,self.timestamp)


def writeLyrics(fileName,inputDir,outputDir,offset=0, newBPM=None):
  fullInputFileDirectory = "./{0}/{1}".format(inputDir,fileName)
  fullOutputFileDirectory = "./{0}/{1}.json".format(outputDir,fileName[:-4]) # Alternatively, do songTitle.
  lyricOverTime = []
  karFile = mf.midifile()

  try:
    karFile.load_file(fullInputFileDirectory)
  except IndexError: #If, for some god-forsaken reason, this doesnt work, Then catch the errors that we are sick of seeing.
    print("Didn't Write '{}'".format(fileName))
  except UnboundLocalError:
    print("Didn't Write '{}'".format(fileName))
  syllables = karFile.karsyl
  times = karFile.kartimes
  bpms = karFile.bpm
  oldBPM = bpms[0][0]

  if offset is None:
    offset = 0
  if newBPM is None or newBPM is 0:
    newBPM = oldBPM
  for i, time in enumerate(times):
    lyric = syllables[i]
    while lyric.find('\xb4') != -1:
      index = lyric.find('\xb4')
      lyric = lyric[:index] + "\'" + lyric[index+1:]
      print("Found Lyric:",index)
    print("LYRIC:", lyric)
    # lyric = lyric.encode(ISO-8859-1')
    stamp = TimeStampEvent(time,lyric)
    stamp.shiftTime(offset)
    stamp.normalizeBPM(oldBPM,newBPM)
    lyricOverTime.append(stamp.__dict__)
  print(lyricOverTime)
  #Convert it to a json String
  jsonTimeStamps = json.dumps(lyricOverTime)

  #Create a new file for it at the full output directory
  timeStampFile = open(fullOutputFileDirectory, "w")

  if jsonTimeStamps != '[]': #Only write it if it has content.
    print("Wrote {}".format(fileName))
    timeStampFile.write(jsonTimeStamps)

  
if __name__ == "__main__":
  # if sys.version_info[0] == 3:
  #   print("USE PYTHON 2!")
  # else:
    inputDir = "../BlueberryPicked" #Default folder: input
    outputDir = "output"  #Default folder: output

    #Processes the actual Tempos file.
    tempoFile = open("realTempos.txt").read()
    songsAndTempos = tempoFile.split('\n')[1:]
    songTempoDict = dict()
    songOffsetDict = dict()
    for line in songsAndTempos:
      songName, data = line.split('|')
      songBPM, songOffset = data.split(',')
      songTempoDict[songName] = float(songBPM)
      songOffsetDict[songName] = float(songOffset)
    
    #Puts the Karaoke File names in a list.
    files = os.listdir("./{}".format(inputDir))
    karaokeFiles = []
    for thing in files: #Check that the files are .kar
      if thing[-4:] == ".kar":
        karaokeFiles.append(thing)

    for fileName in karaokeFiles:
      print("File: " + fileName)
      offset = songOffsetDict.get(fileName[:-4])
      newBPM = songTempoDict.get(fileName[:-4])
      writeLyrics(fileName,inputDir,outputDir,offset,newBPM)

