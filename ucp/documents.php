<?php

include_once '../include/ucp.php';

$documents = configgetvalue('system', 'ucp', NULL, 'documents');

for ($i = 0; $i < count($documents); $i++)
{
    if (!isset($documents[$i]['fileName']) ||
            !isset($documents[$i]['name']))
    {
        array_splice($documents, $i, 1);
    }
    else
    {
        $documents[$i]['ext'] = pathinfo('../ucp/upload/' . $documents[$i]['fileName'], PATHINFO_EXTENSION);
        if (isset($documents[$i]['forceDownload']) && $documents[$i]['forceDownload'])
        {
            $documents[$i]['linkText'] = __("Download");
        }
        else
        {
            $documents[$i]['linkText'] = __("View");
        }
    }
}

$tpl = array(
        "documents" => $documents
);
$fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
$fenom->display($theme->getTemplateLocation('documents.tpl'), $tpl);
$fenom->display($theme->getTemplateLocation('footer.tpl'));
?>
