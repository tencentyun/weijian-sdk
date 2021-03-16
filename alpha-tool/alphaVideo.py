#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# 预装imageMagick和ffmpeg
import os
import subprocess
import sys
import shutil
import argparse

outputVideoPath = ""
imageDir = ""
srcPath = ""
maskPath = ""
outputPath = ""
oVideoFilePath = ""
fps = 30
bitrate = 2000


def main():
	print("转换开始")
	parser = argparse.ArgumentParser(description='manual to this script')
	parser.add_argument('--file', type=str, default = None)
	parser.add_argument('--dir', type=str, default = None)
	parser.add_argument('--fps', type=int, default = 30)
	parser.add_argument('--bitrate', type=int, default = 2000)
	args = parser.parse_args()
	
	fps = args.fps
	bitrate = args.bitrate
	if not args.file is None:
		parseVideoFile(args.file)
	elif not args.dir is None:
		parseImageDir(args.dir)
	else:
		print("没有输入")
		return
	print("转换完毕")

def help():
	print("help ~")


def parseVideoFile(path):
	print("视频文件 %s" % path)

	parentDir = os.path.basename(path)
	parentDir = parentDir.split('.')[0] + "/"

	initDir(parentDir)
	videoToImage(path, imageDir)
	parseImageList(imageDir)
	imagesToVideo(outputPath, oVideoFilePath)

	shutil.rmtree(parentDir + "temp/")
	print("视频转换完成，请查看: %s" % oVideoFilePath)


def parseImageDir(path):
	parentDir = os.path.abspath(path) + "/"
	print("图片目录 %s" % parentDir)

	initDir(parentDir)
	parseImageList(parentDir)
	imagesToVideo(outputPath, oVideoFilePath)

	shutil.rmtree(parentDir + "temp/")
	print("合成完毕，请查看 : %s" % oVideoFilePath)


def initDir(parentDir):
	global imageDir
	imageDir = parentDir + "temp/imageDir/"
	mkdir(imageDir)
	global srcPath
	srcPath = parentDir + "temp/source/"
	mkdir(srcPath)
	global maskPath
	maskPath = parentDir + "temp/mask/"
	mkdir(maskPath)
	global outputPath
	outputPath = parentDir + "temp/output/"
	mkdir(outputPath)
	global outputVideoPath
	outputVideoPath = parentDir + "output/"
	mkdir(outputVideoPath)

	global oVideoFilePath
	oVideoFilePath = outputVideoPath + "video.mp4"


def parseImageList(inputPath):
	fileList = os.listdir(inputPath)
	totalLength = len(fileList)
	progress = 0
	for fileName in fileList:
		if os.path.splitext(fileName)[1] == ".png":
			inputImageFile = inputPath + fileName
			srcImageFile = srcPath + os.path.splitext(fileName)[0] + ".jpg"
			tempMaskImageFile = maskPath + os.path.splitext(fileName)[0] + "_temp.jpg"
			maskImageFile = maskPath + os.path.splitext(fileName)[0] + ".jpg"
			outputImageFile = outputPath + os.path.splitext(fileName)[0] + ".jpg"

			removeAlpha(inputImageFile, srcImageFile)
			separateAlphaChannel(inputImageFile, maskImageFile)
			appendImageLand(srcImageFile, maskImageFile, outputImageFile)

			deleteTempFile(srcImageFile)
			deleteTempFile(maskImageFile)
			deleteTempFile(tempMaskImageFile)

			progress += 1
			updateProgress(progress, totalLength)


def videoToImage(videoPath, imageDir):
	command = "ffmpeg -i {} -r {} {}%03d.png".format(videoPath, fps, imageDir)
	ret = subprocess.Popen(command, shell = True)
	ret.communicate()


def removeAlpha(imageSrc, imageDst):
	command = "convert {} -background black -alpha off {}".format(imageSrc, imageDst)
	ret = subprocess.Popen(command, shell = True)
	ret.communicate()


def separateAlphaChannel(imageFileOne, imageFileTwo):
	command = "convert {} -channel A -separate {}".format(imageFileOne, imageFileTwo)
	ret = subprocess.Popen(command, shell = True)
	ret.communicate()



def appendImageLand(imageFileOne, imageFileTwo, imageFileAppend):
	command = "convert +append {} {} {}".format(imageFileOne, imageFileTwo, imageFileAppend)
	ret = subprocess.Popen(command, shell = True)
	ret.communicate()


def deleteTempFile(filePath):
	if os.path.exists(filePath):
		os.remove(filePath)


def imagesToVideo(imagesPath, videoFile):
	command = "ffmpeg -r {} -i {}%03d.jpg -vcodec libx264 -pix_fmt yuv420p -b {}k {}".format(fps, imagesPath, bitrate, videoFile)
	ret = subprocess.Popen(command, shell = True)
	ret.communicate()


def updateProgress(progress, total):
	percent = round(1.0 * progress / total * 100,2)
	sys.stdout.write('\r进度 : %s [%d/%d]'%(str(percent)+'%', progress, total))
	sys.stdout.flush()


def mkdir(path):
	folder = os.path.exists(path)
	if not folder:
		os.makedirs(path)


if __name__ == '__main__':
	main()