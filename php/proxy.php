<?php
	/**
	* Data proxy, cross-domain for AJAX loading
	* Only available for JSON files, and the file must be in or child-of current directory.
	*/
	
    header("Access-Control-Allow-Origin:*");

    if(empty($_POST['file_url']))
    {
        echo "";
        exit;
    }

	$filePath = '../../'.$_POST['file_url'];
	$index = strrpos($filePath, "?");
	if(is_int($index))
    {
        $filePath = substr($filePath, 0, $index);//remove question mark
    }

	$filePath = realpath($filePath);
	$targetFile = realpath($filePath);
	if($targetFile == false)
	{
		echo 'NOT FOUND!';
		exit;
	}
	
	$targetFileInfo = pathinfo($targetFile);
	$extension = $targetFileInfo['extension'];
	
	if(strtolower($extension) != "json")//only load json files.
	{
		echo "";
		exit;
	}

	$currentDirInfo = pathinfo($_SERVER['SCRIPT_NAME']);
	$currentScript = realpath($currentDirInfo['basename']);
	$currentScriptInfo = pathinfo($currentScript);
	$currentDir = $currentScriptInfo['dirname'];
	$currentParent = substr($currentDir, 0, strlen($currentDir) - strlen("php") - 1);
	
	$targetDir = $targetFileInfo['dirname'];
	$index = strpos($targetDir, $currentParent);
	if(!is_int($index) || $index != 0)//target file must be located at current directory or the child of current directory
	{
		echo 'NOT ALLOW TO ACCESS!';
		exit;
	}
	
	$content = file_get_contents($filePath);
	echo $content;
?>