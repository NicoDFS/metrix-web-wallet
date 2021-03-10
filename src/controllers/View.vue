<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ $t('view.title') }}</span>
      <v-btn v-on:click="onRefresh" color="green">Refresh</v-btn>
    </v-card-title>
    <v-card-text>
      <v-layout v-for="(item, i) in infoLabel" :key="i">
        <v-flex xs3>
          <v-subheader>
            {{ $t('common.info.' + item.label) }}
          </v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-text-field
            v-model="info[item.name]"
            disabled
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-btn small class="mt-3" color="cyan" v-clipboard:copy="info[item.name]" v-clipboard:success="onCopySucc" v-clipboard:error="onCopyError" v-if="item.copy">
            {{ $t('common.copy') }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-if="privKey !== null">
        <v-flex xs3>
          <v-subheader>
            {{ $t('common.info.priv_key') }}
          </v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-text-field
            :append-icon="showPriv ? 'visibility_off' : 'visibility'"
            :type="showPriv ? 'text' : 'password'"
            v-model="privKey"
            @click:append="showPriv = !showPriv"
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-btn small class="mt-3" color="cyan" v-show="showPriv" v-clipboard:copy="privKey" v-clipboard:success="onCopySucc" v-clipboard:error="onCopyError">
            {{ $t('common.copy') }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-if="wallet.info.mrc20.length > 0">
        <v-flex xs3>
          <v-subheader>
            MRC20
          </v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-card flat tile :color="'grey darken-'+(i%2+1)" style="border-bottom: 2px solid #000;padding: 15px 10px;" v-for="(token, i) in wallet.info.mrc20" :key="i">
            <v-layout>
              <v-flex xs5>{{ token.name }}</v-flex>
              <v-flex xs7>{{ token.balance }} {{ token.symbol }}</v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import webWallet from 'libs/web-wallet'
import track from 'libs/track'

export default {
  data() {
    return {
      infoLabel: [
        { label: 'address', name: 'address', copy: true },
        { label: 'balance', name: 'balance' },
        { label: 'unconfirmed_balance', name: 'unconfirmedBalance' },
      ],
      wallet: webWallet.getWallet(),
      showPriv: false,
    }
  },
  props: ['view'],
  watch: {
    view: function() {
      this.wallet.setInfo()
    }
  },
  computed: {
    info: function() {
      return this.wallet.info
    },
    privKey: function() {
      return this.wallet.getPrivKey()
    }
  },
  methods: {
    onCopySucc: function() {
      track.trackAction('copy', 'view', 'privkey')
      this.$root.success('copy success')
    },
    onCopyError: function() {
      this.$root.error('copy fail')
    },
    onRefresh: function() {
      this.wallet.setInfo()
    }
  }
}
</script>
