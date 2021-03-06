import React, { useState, useContext } from 'react';

import { StoreContext, RatesContext } from '@services';
import { ExtendedAsset, StoreAsset } from '@types';

import { TokenList } from './TokenList';
import { TokenDetails } from './TokenDetails';
import { AddToken } from './AddToken';

export function TokenPanel() {
  const { totals, currentAccounts, scanTokens } = useContext(StoreContext);
  const { getAssetRate } = useContext(RatesContext);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<StoreAsset>();
  const [isScanning, setIsScanning] = useState(false);
  const allTokens = totals(currentAccounts).reduce((acc, a) => {
    if (a.contractAddress) {
      acc.push({ ...a, rate: getAssetRate(a) || 0 });
    }
    return acc;
  }, [] as StoreAsset[]);

  const handleScanTokens = async (asset?: ExtendedAsset) => {
    try {
      setIsScanning(true);
      await scanTokens(asset);
      setIsScanning(false);
    } catch (e) {
      setIsScanning(false);
    }
  };

  return showDetailsView && currentToken ? (
    <TokenDetails currentToken={currentToken} setShowDetailsView={setShowDetailsView} />
  ) : showAddToken ? (
    <AddToken
      setShowDetailsView={setShowDetailsView}
      setShowAddToken={setShowAddToken}
      scanTokens={handleScanTokens}
    />
  ) : (
    <TokenList
      tokens={allTokens}
      setShowDetailsView={setShowDetailsView}
      setCurrentToken={setCurrentToken}
      isScanning={isScanning}
      setShowAddToken={setShowAddToken}
      handleScanTokens={handleScanTokens}
    />
  );
}
