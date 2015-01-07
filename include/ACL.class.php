<?php

class ACL
{
  public function get()
  {
    global $sessionId, $response;
    $masterTable= new Table('master');
    $master=$masterTable->loadById( $sessionId );
    $userGroupId=$master['group'];

    $groupTable= new Table('group');
    $group=$groupTable->loadById( $userGroupId );
    $userAcl=json_decode($group['acl'], true);
    $response['acl'] = $userAcl;
  }
}

?>
