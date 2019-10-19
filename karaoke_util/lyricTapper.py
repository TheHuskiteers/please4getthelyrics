import time,sys,json

import termios, tty
def _getch():
   fd = sys.stdin.fileno()
   old_settings = termios.tcgetattr(fd)
   try:
      tty.setraw(fd)
      ch = sys.stdin.read(1)     #This number represents the length
   finally:
      termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
   return ch

def songTapper(lyricDir, outputFolder):
  lyricFile = open(lyricDir)
  fileName = lyricDir.split('/')[-1]
  lyrics = json.load(lyricFile)
  lyrics =list(lyrics)
  lyricSections = [[]]
  includeLastLyric = False
  print("Press enter when exactly when you start the track:")
  _getch()
  print("BEGIN!")
  startTime = time.time()
  bannedCharacters = ['/','\\','.',' ','']
  for i,lyric in enumerate(lyrics):
    if str(lyric[u'lyric']) not in bannedCharacters:
      char = _getch()
      if char == 'q':
        break
      elif char == '\t':
        lyricSections.append([])
        print("NEXT SECTION:")
      print('{0} {2} ({1})'.format(lyric[u'lyric'], lyrics[i+2][u'lyric'],' '* 20))
      currentTime = time.time()
      if includeLastLyric:
        lyricSections[-1].append({u'lyric': lyrics[i-1][u'lyric'], u'timestamp': currentTime - startTime - .00001})
        includeLastLyric = False
      lyricSections[-1].append({u'lyric': lyric[u'lyric'],u'timestamp': currentTime - startTime})
    else:
      includeLastLyric = True
  fileContent = json.dumps(lyricSections)
  finalFile = open("./{0}/{1}".format(outputFolder,fileName), 'w')
  finalFile.write(fileContent)

          

if __name__ == "__main__": 
    if len(sys.argv) > 1:
      fullInputFile = sys.argv[1] #Default folder: input
      name = fullInputFile.split('/')[-1]
      print("File Name:",name)
    else:
      raise AttributeError("Please include file you are converting as an argument!!")
    outputDir = "manuallyTempoedFiles"  #Default folder: output
    songTapper(fullInputFile,outputDir)