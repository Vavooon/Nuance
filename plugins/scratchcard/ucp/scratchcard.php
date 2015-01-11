<?php


class ScratchCard 
{
  private $codeLength;
  public function __construct($resp=NULL)
  {
    $response=$resp ? $resp : new response();
    //if (!tableExists('scratchcards')) $this->install();
    $this->table=new Table('scratchcard');
    $this->codeLength=$this->table->header[1][2];
  }
  public function pay($code, $userId)
  {
    if (preg_match("/^\d{".$this->codeLength."}$/", $code)) 
    {
      $cardmatch=$this->table->load("WHERE activated=0 AND code='$code'");
      if (count($cardmatch)==1)
      {
        $card=$cardmatch[0];
        $this->table->edit( array( 'id' => $card['id'], 'activated'=> 1, 'activationdate' => date("Y-m-d H:i:s") , 'user' => $userId) );
        $moneyflowTable=new Table('moneyflow');
        $paySum=floatval($card['value']);
        $moneyflowTable->add ( array 
          (
            "detailsname" => "scratchcard",
            "detailsid"   => $card['id'],
            "user"        => $userId,
            "sum"         => $paySum
          )
        );
        return $paySum;
      }
      else
      {
        logInfo('payment', 'badscratchcard', NULL, $userId, NULL, array());
        return false;
      }
    }
  }
}
