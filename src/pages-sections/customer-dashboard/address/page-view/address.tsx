import { Fragment } from "react";
// CUSTOM COMPONENT
import Location from "icons/Location";
import Pagination from "../../pagination";
import AddressListItem from "../address-item";
import DashboardHeader from "../../dashboard-header";
// CUSTOM DATA MODEL
import Address from "models/Address.model";

  totalPages: number;
  addresses: Address[];
}
  return (
    <Fragment>
      <DashboardHeader Icon={Location} title="My Addresses" />

      {addresses.map((address) => (
        <AddressListItem key={address.id} address={address} />
      ))}

      <Pagination count={totalPages} />
    </Fragment>
  );
}
