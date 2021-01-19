import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar';
import { TxButton } from './substrate-lib/components';

// --- About Modal ---

const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});
  const formChange = key => (ev, el) => {
    /* TODO: 加代码 */
    setFormValue(el.value);
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  if (kitty.owner === accountPair.address) {
    return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
      trigger={<Button basic color='blue'>转让</Button>}>
      <Modal.Header>小猫转让</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input fluid label='小猫 ID' readOnly value={kitty.id}/>
          <Form.Input fluid label='转让对象' placeholder='对方地址' onChange={formChange}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
        <TxButton
          accountPair={accountPair} label='确认转让' type='SIGNED-TX' setStatus={setStatus}
          onClick={confirmAndClose}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'transfer',
            inputParams: [formValue.target, kitty.id],
            paramFields: [true, true]
          }}
        />
      </Modal.Actions>
    </Modal>;
  } else {
    return null;
  }
};

// --- About Kitty Card ---

// 标签组件,在Card组件的右上角展示一些标签信息
const KittyLabel = props => {
  const { kitty, accountPair } = props;
  if (kitty.owner === accountPair.address) {
    return (
      <Label style={ { backgroundColor: 'green' } }>
          我的
      </Label>
    );
  } else {
    return null;
  }
};

// 小猫的组件卡片展示小猫的基础信息
const KittyCard = props => {
  /*
    TODO: 加代码。这里会 UI 显示一张 `KittyCard` 是怎么样的。这里会用到：
    ```
    <KittyAvatar dna={dna} /> - 来描绘一只猫咪
    <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/> - 来作转让的弹出层
    ```
  */
  const { kitty, accountPair, setStatus } = props;

  return (
    <Card>
      <Card.Content>
          <KittyLabel kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
          <KittyAvatar dna={kitty.dna}/>
          <Message>
              <Card.Header>ID号: {kitty.id}</Card.Header><br/>
              <span style={{overflowWrap: 'break-word'}}>基因: {kitty.dna.join(",")}</span><br/><br/>
              <span style={{overflowWrap: 'break-word'}}>猫奴: {kitty.owner}</span><br/><br/>
              <span style={{overflowWrap: 'break-word'}}>价格: {kitty.price}</span><br/>
          </Message>
      </Card.Content>
      <Card.Content extra>
          <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
      </Card.Content>
    </Card>
 );
};

const KittyCards = props => {
  const { kitties, accountPair, setStatus } = props;

  /* TODO: 加代码。这里会枚举所有的 `KittyCard` */
  if (kitties.length > 0) {
    return (
        <Grid stackable columns='equal'>
            {
              kitties.map(item => {
                  return (
                    <Grid.Column key={item.id} width={6}>
                        <KittyCard kitty={item} accountPair={accountPair} setStatus={setStatus}/>
                    </Grid.Column>
                  )
              })
            }
        </Grid>
    );
  } else {
      return (
        <Label style={{ textAlign: 'center' }}>
          空空如野, 赶紧去购买小猫吧 ^ _ ^
        </Label>
      );
  }
};

export default KittyCards;
