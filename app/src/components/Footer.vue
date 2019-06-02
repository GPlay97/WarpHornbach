<template>
    <v-footer height="auto" color="primary lighten-1" absolute>
        <v-layout justify-center row wrap>
            <v-btn v-for="link in links" :key="link.name" color="white" :href="link.href" flat round>
                {{ link.name }}
            </v-btn>
            <v-flex primary lighten-2 py-3 text-xs-center white--text xs12>
                &copy;2019 - <strong>GPlay97</strong>
            </v-flex>
        </v-layout>
    </v-footer>
</template>

<script>
    export default {
        data: () => ({
            links: [{
                name: 'GitHub',
                href: 'https://github.com/GPlay97/WarpHornbach'
            }, {
                name: 'Privacy',
                href: 'https://evnotify.de/datenschutz'
            }, {
                name: 'Imprint',
                href: 'https://evnotify.de/impressum'
            }]
        })
    }
</script>