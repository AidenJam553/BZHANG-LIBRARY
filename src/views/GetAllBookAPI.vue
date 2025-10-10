<template>
  <pre>{{ jsondata }}</pre>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      jsondata: null,
      error: null
    };
  },
  mounted() {
    this.getAllBooksAPI();
  },
  methods: {
    async getAllBooksAPI() {
      try {
        const response = await axios.get('http://127.0.0.1:5001/week7-bohan/us-central1/getAllBooks');
        this.jsondata = response.data;
        this.error = null;
      } catch (error) {
        console.error('Error fetching all books:', error);
        this.error = error;
        this.jsondata = null;
      }
    }
  }
};
</script>
