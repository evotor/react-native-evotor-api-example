package com.revotor

import android.app.Activity
import android.os.Bundle
import android.util.Log
import kotlinx.android.synthetic.main.activity_native.*
import ru.evotor.framework.core.action.event.receipt.changes.position.SetExtra

class NativeActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_native)
        val extras = intent.extras
        Log.v("NativeActivity", "key1: ${extras.getString("key1")}")
        val arrayExtra = extras.getSerializable("key2") as List<*>
        Log.v("NativeActivity", "key2[0]: ${arrayExtra[0]}")
        Log.v("NativeActivity", "key2[1]: ${arrayExtra[1]}")
        Log.v("NativeActivity", "key2[2]: ${arrayExtra[2] as Map<*, *>}")
        Log.v("NativeActivity", "native readable: ${SetExtra.from(extras.getBundle("native readable"))}")
        resultBut.setOnClickListener({ finish() })
    }
}
