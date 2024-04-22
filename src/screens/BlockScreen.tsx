import * as React from "react";

export interface IBlockScreenProps {}
export const BlockScreen: React.FC<IBlockScreenProps> = function ({}) {
  return <div className="block-user-content">Вы заблокированы на сайте!</div>;
};
