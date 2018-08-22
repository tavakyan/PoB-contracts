const ConsortiumSet = artifacts.require('ConsortiumSet')
const AddressVotes = artifacts.require('AddressVotes')

contract('Consortium Unit Tests', accounts => {
  let set
  const validator = accounts[0]
  const system = '0x00fffffffffffffffffffffffffffffffffffffffe'

  beforeEach(async () => {
    av = await AddressVotes.new()
    set = await ConsortiumSet.new([validator])
  })

  it('Ctor should populate with initial validators', async () => {
    const val_list = await set.getValidators()
    console.log('val list: ' + val_list)
    assert.deepEqual(val_list, [validator]) //['0xf5777f8133aae2734396ab1d43ca54ad11bfb737'])
  })

  it('isInValidatorSet handles edge cases', async () => {
    const val_list = await set.getValidators()
    const res = await set.isInValidatorSet(val_list[0])
    assert.equal(res, true)
    const res2 = await set.isInValidatorSet('0x0')
    assert.equal(res2, false)
  })

  it('Should add a validator only when supported', async () => {
    // First finalize to allow addSupport to initiate change
    await set.finalizeChange()

    const new_val = accounts[1]

    // First try to add validator without support.
    // This should fail
    try {
      await set.addValidator(new_val, { from: validator })
      assert.fail("Expected a revert but it didn't happen...")
    } catch (e) {
      const revertFound = e.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${e} instead`)
    }

    // Then add support, which will call addValidator
    await set.addSupport(new_val, { from: validator })
    console.log('val support: ' + (await set.getSupport(validator)))
    console.log('new_val support: ' + (await set.getSupport(new_val)))

    await set.finalizeChange()

    assert.deepEqual(await set.getValidators(), [validator, accounts[1]])
  })
})
