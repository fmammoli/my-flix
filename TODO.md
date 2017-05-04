### problems on tests
Hash does not close the files after opening read stream, these causes a permission error on the tests.
I put a .destoy() there, dont know if these is a good practice, should probably wait for the close event before resolving the promise.