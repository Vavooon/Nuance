<?php
class ScratchCard
{
  private $db;
  public $response;
  private function install()
  {
    
    sql_request("CREATE TABLE IF NOT EXISTS `scratchcard` (
      `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
      `code` int(10) unsigned NOT NULL,
      `userid` int(10) unsigned DEFAULT NULL,
      `activated` bit(1) DEFAULT NULL,
      `activationdate` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `code` (`code`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
    c("Created new table");
  }
  public function __construct($resp=NULL)
  {
    global $db;
    $this->db=$db;
    $this->response=$resp ? $resp : new response();
    if (!tableExists('scratchcard')) $this->install();
    $this->table=new table('scratchcard');
  }
  public function pay($code, $userId)
  {
    if (preg_match("/^\d{".$this->codeLength."}$/", $code)) 
    {
      $usersTable=new table('user');
      $cardmatch=$this->table->load("WHERE activated=0 AND code='$code'");
      $usermatch=$usersTable->load("WHERE id=$userId");
      c(" WHERE activated=1 AND code='$code'");
      c($userId);
      if (count($usermatch)==1 && count($cardmatch)==1)
      {
        c(42);
        $card=$cardmatch[0];
        $user=$usermatch[0];
        $paySum=intval($card['value']);
        $usersTable->edit( array ( 'id' => $userId, 'cash'=> intval($user['cash']) + $paySum) );
        $this->table->edit( array( 'id' => $card['id'], 'activated'=> 1, 'activationdate' => date("Y-m-d H:i:s") , 'user' => $userId) );
        return $paySum;
      }
      else
      {
        l('payment', 'badscratchcard', NULL, $userId, NULL, array());
      }
      return false;
    }
  }
  public function generate($number, $value, $delimiter=";")
  {
    if (!intval($number) && !intval($value)) return false;
    for ($i=0; $i<$number; $i++)
    {
      //$code=rand(10000, 99999).rand(10000, 99999);
      $code=sprintf("%010d", mt_rand());
      $codeLength=$this->table->header[1][2];
      while (strlen($code) < $codeLength)
      {
        $code.=rand(0,9);
      }
      $newId=$this->table->add(array('code' => $code, 'value' => $value, 'activated' => 0));
      if(!$newId)
      {
        $number++;
        if ($number-5>$n)
        {
          echo("Too much collisions.");
          $this->response->success=false;
          return;
        }
      }
      else $this->response->data[]=sprintf("%010d", $newId).$delimiter.$code;
    }
    c("Successfully generated {$number} codes with value {$value}.");
    $this->response->success=true;
  }
}
