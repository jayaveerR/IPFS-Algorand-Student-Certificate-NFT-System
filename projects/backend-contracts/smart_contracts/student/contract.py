from algopy import ARC4Contract, String, UInt64, Global, itxn, arc4, Txn

class Student(ARC4Contract):
    @arc4.abimethod
    def mint(self, asset_name: String, unit_name: String, url: String) -> UInt64:
        # Create the certificate NFT
        # Assign management keys to the sender (Issuer) so they have control
        created_asset = itxn.AssetConfig(
            total=1,
            decimals=0,
            asset_name=asset_name,
            unit_name=unit_name,
            url=url,
            manager=Txn.sender,
            reserve=Txn.sender,
            freeze=Txn.sender,
            clawback=Txn.sender,
        ).submit().created_asset

        # Verify asset was created
        asset_id = created_asset.id

        return asset_id
