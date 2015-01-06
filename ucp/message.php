<?php

include_once '../include/ucp.php';

if (!$user->isValid())
{
    redirect('login.php');
}
else if (!$user->isEnabled())
{
    redirect('disabled.php');
}
else
{

    function markAsRead($id)
    {
        
    }

    $messageTable = new table('message');
    $action = isset($_GET['action']) ? $_GET['action'] : 'notset';
    switch ($action)
    {
        case 'list':
            {
                $request = "WHERE (`sender`=" . $user->getId() . " AND `sender_is_admin`=0) OR ";
                $request .= "(`recipient`=" . $user->getId() . " AND `recipient_is_admin`=0)";
                $messages = $messageTable->load($request);
                foreach ($messages as $key => $message)
                {
                    if ($message['recipient'] === $user->getId() && $message['recipient_is_admin'] === 0)
                    {
                        $messages[$key]['incoming'] = true;
                    }
                    else
                    {
                        $messages[$key]['incoming'] = false;
                    }
                }
                $tpl = array(
                        "messages" => $messages,
                );
                $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
                $fenom->display($theme->getTemplateLocation('messageslist.tpl'), $tpl);
                $fenom->display($theme->getTemplateLocation('footer.tpl'));
            }
            break;
        case 'show':
        case 'showredirect':
            {
                $messageId = isset($_GET['id']) ? intval($_GET['id']) : 0;
                $request = "";
                if ($messageId)
                {
                    $request .= " WHERE ((`recipient`=" . $user->getId() . " AND `recipient_is_admin`=0) OR (`sender`=" . $user->getId() . " AND `sender_is_admin`=0)) AND `id`={$messageId} ";
                }
                else
                {
                    $request .= " WHERE `recipient`=" . $user->getId() . " AND `recipient_is_admin`=0 AND `is_new`=1 ";
                }
                $request .= "LIMIT 1";
                $messages = $messageTable->load($request);
                $message = $messages[0];
                $message['text'] = str_replace("\n", "<br>", $message['text']);
                if ($message['recipient'] === $user->getId() && $message['recipient_is_admin'] === 0)
                {
                    $message['incoming'] = true;
                }
                else
                {
                    $message['incoming'] = false;
                }
                $tpl = array(
                        "message" => $message,
                );
                $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
                $fenom->display($theme->getTemplateLocation('showmessage.tpl'), $tpl);
                $fenom->display($theme->getTemplateLocation('footer.tpl'));
            }
            break;
        case 'compose':
            {
                $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
                $fenom->display($theme->getTemplateLocation('newmessage.tpl'));
                $fenom->display($theme->getTemplateLocation('footer.tpl'));
            }
            break;
        case 'markasread':
            {
                $request = "WHERE ((`sender`=" . $user->getId() . " AND `sender_is_admin`=0) OR ";
                $request .= "(`recipient`=" . $user->getId() . " AND `recipient_is_admin`=0)) ";
                if (isset($_GET['id']))
                {
                    $request .= "AND `id`=" . intval($_GET['id']);
                }
                $request = "UPDATE " . DB_TABLE_PREFIX . "`message` SET `is_new`=0, `readdate`='" . date($mysqlTimeDateFormat) . "' " . $request;
                $db->query($request);

                // Check for another unread messages 
                $request = "WHERE `recipient`=" . $user->getId() . " AND `recipient_is_admin`=0 AND `is_new`=1";
                $newMessages = $messageTable->load($request);
                if (count($newMessages))
                {
                    $nextMessage = $newMessages[0];

                    redirect('message.php?action=show&id=' . $nextMessage['id']);
                }
                else
                {
                    $usersTable = new table('user');
                    $row = $usersTable->loadById($user->getId());
                    controllerRouterQueue($row['router'], "hidemessage", $user->getId());
                    redirect('message.php?action=finish');
                }
            }
            break;
        case 'send':
            {
                if (isset($_POST['text']) && $_POST['text'])
                {
                    $messageText = htmlspecialchars($_POST['text']);
                    $messageTable->add(
                            array(
                                    "text" => $messageText,
                                    "sender" => $user->getId(),
                                    "sender_is_admin" => 0,
                                    "recipient" => 0,
                                    "is_new" => 1,
                                    "recipient_is_admin" => 1,
                                    "date" => date($mysqlTimeDateFormat)
                            )
                    );
                }
                redirect('message.php?action=messagehasbeensent');
            }
            break;
        case 'messagehasbeensent':
            {
                $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
                $fenom->display($theme->getTemplateLocation('messagehasbeensent.tpl'));
                $fenom->display($theme->getTemplateLocation('footer.tpl'));
            }
            break;
        case 'finish':
            {
                $fenom->display($theme->getTemplateLocation('header.tpl'), $headerData);
                $fenom->display($theme->getTemplateLocation('messagehasbeenhidden.tpl'));
                $fenom->display($theme->getTemplateLocation('footer.tpl'));
            }
            break;
        default:
            {
                redirect('message.php?action=list');
            }
    }
}
?>
