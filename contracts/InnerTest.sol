//! Copyright 2018 C4Coin
//!
//! Licensed under the Apache License, Version 2.0 (the "License");
//! you may not use this file except in compliance with the License.
//! You may obtain a copy of the License at
//!
//!     http://www.apache.org/licenses/LICENSE-2.0
//!
//! Unless required by applicable law or agreed to in writing, software
//! distributed under the License is distributed on an "AS IS" BASIS,
//! WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//! See the License for the specific language governing permissions and
//! limitations under the License.
//!
//! Original code taken from https://github.com/paritytech/contracts

pragma solidity ^0.4.23;

import "./interfaces/RelaySet.sol";

contract InnerTest is InnerSet {
	event ChangeFinalized(address[] current_set);

	constructor(address _outer) public {
		outerSet = OuterSet(_outer);
	}

	address[] dummy;

	function getValidators() public constant returns (address[]) {
		return dummy;
	}

	function finalizeChange() public {
		emit ChangeFinalized(dummy);
	}

	function changeValidators() public {
		outerSet.initiateChange(0, dummy);
	}
}