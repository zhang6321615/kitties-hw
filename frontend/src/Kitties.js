import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kittyPrices, setKittyPrices] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');

  const fetchKittyCnt = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
    let unsubscribe;
    api.query.kittiesModule.kittiesCount(get_count => {
        console.log("kittie_count:", get_count.toString())
        setKittyCnt(get_count.toNumber());
    }).then(unsub => {
        unsubscribe = unsub;
    }).catch(console.error);

    return () => unsubscribe && unsubscribe();
  };

  const fetchKitties = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
    let unsubscribe;

    const all_index = Array.from(Array(kittyCnt), (v, k) => k);

    api.query.kittiesModule.kitties.multi(all_index, all_kitties => {
        api.query.kittiesModule.kittyOwners.multi(all_index, all_owner => {
            api.query.kittiesModule.kittyPrices.multi(all_index, all_price => {
                all_kitties.forEach(function (item, index, arr) {
                    arr[index].id = index;
                    arr[index].dna = item.unwrap();
                    arr[index].owner = keyring.encodeAddress(all_owner[index].unwrap());
                    arr[index].price =  all_price[index].isEmpty?'无报价':all_price[index].unwrap();
                })
                // console.log("all_kitties:", all_kitties);
                setKitties(all_kitties);
            }).then(unsub => {
                unsubscribe = unsub;
            }).catch(console.error);
        }).then(unsub => {
            unsubscribe = unsub;
        }).catch(console.error);
    }).then(unsub => {
        unsubscribe = unsub;
    }).catch(console.error);

    return () => unsubscribe && unsubscribe();
  };

  const populateKitties = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt]);
  useEffect(populateKitties, [kittyDNAs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>小猫</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小猫' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
